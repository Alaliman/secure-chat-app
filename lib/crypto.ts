// utils/crypto.ts

import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const key = process.env.NEXT_PUBLIC_CRYPTO_KEY!;
const iv = crypto.randomBytes(16);

console.log(iv, key);

if (!key) {
  throw new Error('Environment variable NEXT_PUBLIC_CRYPTO_KEY is not set.');
}
export const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (text: string) => {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift()!, 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// export const encrypt = (text: string): string => {
//   const iv = crypto.randomBytes(16);
//   const cipher = crypto.createCipheriv(algorithm, key, iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex');
//   const ivBase64 = iv.toString('base64');

//   return `${ivBase64}:${encrypted}`;
// }

// export const decrypt = (encryptedString: string): string => {
//   const [ivBase64, encryptedText] = encryptedString.split(':');
//   const ivBuffer = Buffer.from(ivBase64, 'base64');
//   const decipher = crypto.createDecipheriv(algorithm, key, ivBuffer);
//   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//   decrypted += decipher.final('utf8');
//   return decrypted;
// }
