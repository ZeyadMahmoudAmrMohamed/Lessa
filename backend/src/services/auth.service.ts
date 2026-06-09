import { getDb } from '../db/client.js';
import { Errors } from '../lib/errors.js';

interface RegisterInput {
  full_name: string;
  phone: string;
  password: string;
}

interface LoginInput {
  phone: string;
  password: string;
}

export class AuthService {
  private db = getDb();

  /**
   * Register a new citizen via Supabase Auth.
   * Phone is used as the email field with a @phone.lessa domain convention
   * so Supabase Auth can accept it — real phone auth (OTP) is a future upgrade.
   */
  async register(input: RegisterInput) {
    const emailAlias = `${input.phone}@phone.lessa`;

    // Create Supabase Auth user
    const { data: authData, error: authError } = await this.db.auth.admin.createUser({
      email: emailAlias,
      password: input.password,
      email_confirm: true,
      app_metadata: { role: 'citizen' },
      user_metadata: { full_name: input.full_name, phone: input.phone },
    });

    if (authError) {
      if (authError.message?.toLowerCase().includes('already')) {
        throw Errors.conflict('رقم الهاتف مسجّل بالفعل');
      }
      throw Errors.internal(authError.message);
    }

    const userId = authData.user.id;

    // Insert profile row
    const { error: profileError } = await this.db.from('profiles').insert({
      id: userId,
      full_name: input.full_name,
      phone: input.phone,
      role: 'citizen',
    });

    if (profileError) {
      // Attempt cleanup to avoid orphan auth users
      await this.db.auth.admin.deleteUser(userId);
      throw Errors.internal(profileError.message);
    }

    // Issue a session token
    const { data: sessionData, error: sessionError } = await this.db.auth.admin.generateLink({
      type: 'magiclink',
      email: emailAlias,
    });

    // Fall back to sign-in to get a real session token
    const { data: signIn, error: signInError } = await this.db.auth.signInWithPassword({
      email: emailAlias,
      password: input.password,
    });

    if (signInError) throw Errors.internal(signInError.message);

    return {
      token: signIn.session?.access_token,
      user: { id: userId, role: 'citizen', name: input.full_name },
    };
  }

  async login(input: LoginInput) {
    const emailAlias = `${input.phone}@phone.lessa`;

    const { data, error } = await this.db.auth.signInWithPassword({
      email: emailAlias,
      password: input.password,
    });

    if (error || !data.session) {
      throw Errors.unauthorized('بيانات الدخول غير صحيحة');
    }

    const role = data.user.app_metadata?.role ?? 'citizen';
    const name = data.user.user_metadata?.full_name ?? '';

    return {
      token: data.session.access_token,
      user: { id: data.user.id, role, name },
    };
  }
}
