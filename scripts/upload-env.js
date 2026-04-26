import { execSync } from 'child_process';

const envVars = {
  VITE_FIREBASE_API_KEY: 'AIzaSyDD_YqrbEG0YAO-w-zfKBEefy-uNXjxGLw',
  VITE_FIREBASE_AUTH_DOMAIN: 'reservi-io-test.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'reservi-io-test',
  VITE_FIREBASE_STORAGE_BUCKET: 'reservi-io-test.firebasestorage.app',
  VITE_FIREBASE_MESSAGING_SENDER_ID: '285737035778',
  VITE_FIREBASE_APP_ID: '1:285737035778:web:ffb823868f133f3453df1b',
  VITE_GA_ID: 'G-TN6K7Z1FG3'
};

const envs = ['production', 'preview', 'development'];

for (const [key, value] of Object.entries(envVars)) {
  for (const env of envs) {
    try {
      console.log(`Adding ${key} to ${env}...`);
      const cmd = `npx vercel env add ${key} ${env} --non-interactive`;
      execSync(cmd, { input: value });
    } catch (err) {
      try {
        console.log(`Updating ${key} in ${env}...`);
        const updateCmd = `npx vercel env rm ${key} ${env} --yes --non-interactive`;
        execSync(updateCmd);
        const addCmd = `npx vercel env add ${key} ${env} --non-interactive`;
        execSync(addCmd, { input: value });
      } catch (updateErr) {
        console.error(`Failed for ${key} in ${env}:`, updateErr.message);
      }
    }
  }
}
console.log('Environment variables successfully pushed to Vercel!');
