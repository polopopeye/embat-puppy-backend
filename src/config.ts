import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    google: {
      projectID: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      },
    },
    redis: {
      url: process.env.REDIS_URL,
      cacheTimeOut: process.env.REDIS_CACHE_TIME_SECONDS,
    },
  };
});
