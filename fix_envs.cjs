const { execSync } = require('child_process');
const fs = require('fs');
const envs = {
    'RESEND_API_KEY': 're_aKNtuGAU_EUyyL7AVgYxwk7qUNFprMHk5',
    'VITE_HOTJAR_ID': 'XXXXXXX',
    'VITE_GA_ID': 'G-CPL7E7N0RN',
    'VITE_GSC_VERIFICATION': 'YOUR_GSC_VERIFICATION_CODE_HERE',
    'VITE_FIREBASE_APP_ID': '1:121038881855:web:383d38a1757cb84b3f248a',
    'VITE_FIREBASE_MESSAGING_SENDER_ID': '121038881855',
    'VITE_FIREBASE_STORAGE_BUCKET': 'reservi-prelaunch.firebasestorage.app',
    'VITE_FIREBASE_PROJECT_ID': 'reservi-prelaunch',
    'VITE_FIREBASE_AUTH_DOMAIN': 'reservi-prelaunch.firebaseapp.com',
    'VITE_FIREBASE_API_KEY': 'AIzaSyCZbmo8XF7VkpF0b8Lzyt__iKO2Icssm5Q'
};

for (const [key, val] of Object.entries(envs)) {
    console.log(`Fixing ${key}...`);
    try { execSync(`vercel env rm ${key} production -y`); } catch (e) {}
    try { execSync(`vercel env rm ${key} development -y`); } catch (e) {}
    
    fs.writeFileSync('tmp_env_val.txt', val);
    try { execSync(`vercel env add ${key} production < tmp_env_val.txt`, { stdio: 'inherit' }); } catch(e) {}
    try { execSync(`vercel env add ${key} development < tmp_env_val.txt`, { stdio: 'inherit' }); } catch(e) {}
}
if (fs.existsSync('tmp_env_val.txt')) fs.unlinkSync('tmp_env_val.txt');
