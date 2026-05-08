const { execSync } = require('child_process');
const fs = require('fs');

const envContent = fs.readFileSync('.env', 'utf-8');
const lines = envContent.split('\n');
const envs = ['production', 'development', 'preview'];

lines.forEach(line => {
  const match = line.match(/^([^#\s]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let value = match[2].trim();
    if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
    }
    
    envs.forEach(e => {
      console.log(`Removing ${key} from ${e}...`);
      try { execSync(`npx vercel env rm ${key} ${e} -y`, { stdio: 'ignore' }); } catch(err) {}
      
      console.log(`Adding ${key} to ${e}...`);
      try {
        execSync(`npx vercel env add ${key} ${e}`, { input: value + '\n\n', stdio: 'pipe' });
      } catch (err) {
        console.error(`Failed to add ${key} to ${e}`);
      }
    });
  }
});
