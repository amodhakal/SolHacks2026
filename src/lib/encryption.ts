import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 12; // 96 bits for GCM recommended

function getMasterKey(masterKeyHex?: string): Buffer {
  const hex = masterKeyHex || process.env.HIPAA_MASTER_KEY;
  if (hex) {
    return Buffer.from(hex, 'hex');
  }
  return crypto.scryptSync('medilin-hipaa-default-kek-secret', 'salt', KEY_LENGTH);
}

export interface EncryptedEnvelope {
  ciphertext: string;
  encryptedDEK: string;
  iv: string;
  dekIv: string;
  authTag: string;
  dekAuthTag: string;
}

export function encryptPHI(plaintext: string, masterKeyHex?: string): EncryptedEnvelope {
  const masterKey = getMasterKey(masterKeyHex);

  // 1. Generate unique DEK
  const dek = crypto.randomBytes(KEY_LENGTH);

  // 2. Encrypt plaintext (PHI) using DEK
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, dek, iv);
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  // 3. Encrypt DEK using Master Key (KEK)
  const dekIv = crypto.randomBytes(IV_LENGTH);
  const dekCipher = crypto.createCipheriv(ALGORITHM, masterKey, dekIv);
  let encryptedDEK = dekCipher.update(dek);
  encryptedDEK = Buffer.concat([encryptedDEK, dekCipher.final()]);
  const dekAuthTag = dekCipher.getAuthTag().toString('hex');

  return {
    ciphertext,
    encryptedDEK: encryptedDEK.toString('hex'),
    iv: iv.toString('hex'),
    dekIv: dekIv.toString('hex'),
    authTag,
    dekAuthTag,
  };
}

export function decryptPHI(envelope: EncryptedEnvelope, masterKeyHex?: string): string {
  const masterKey = getMasterKey(masterKeyHex);

  // 1. Decrypt DEK using Master Key
  const dekIvBuf = Buffer.from(envelope.dekIv, 'hex');
  const dekAuthTagBuf = Buffer.from(envelope.dekAuthTag, 'hex');
  const encryptedDEKBuf = Buffer.from(envelope.encryptedDEK, 'hex');

  const dekDecipher = crypto.createDecipheriv(ALGORITHM, masterKey, dekIvBuf);
  dekDecipher.setAuthTag(dekAuthTagBuf);
  let dek = dekDecipher.update(encryptedDEKBuf);
  dek = Buffer.concat([dek, dekDecipher.final()]);

  // 2. Decrypt ciphertext using DEK
  const ivBuf = Buffer.from(envelope.iv, 'hex');
  const authTagBuf = Buffer.from(envelope.authTag, 'hex');

  const decipher = crypto.createDecipheriv(ALGORITHM, dek, ivBuf);
  decipher.setAuthTag(authTagBuf);
  let plaintext = decipher.update(envelope.ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
}
