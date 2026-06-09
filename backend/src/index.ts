import { env } from './lib/env.js';
import { createApp } from './app.js';

const app = createApp();

app.listen(env.PORT, () => {
  console.log(`✅  Lessa? API running on port ${env.PORT} [${env.NODE_ENV}]`);
});
