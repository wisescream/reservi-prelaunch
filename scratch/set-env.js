import { exec } from 'child_process';
const p = exec('npx vercel env add RESEND_API_KEY production');
p.stdin.write('re_aKNtuGAU_EUyyL7AVgYxwk7qUNFprMHk5');
p.stdin.end();
p.stdout.pipe(process.stdout);
p.stderr.pipe(process.stderr);
