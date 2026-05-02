const JSON_PREFIX = 'enc:json:v1:';
const RESPONSE_CRYPTO_FALLBACK_SECRET = 'edusense-response-encryption-v1';

const responseSecret = import.meta.env.VITE_API_RESPONSE_CRYPTO_SECRET || RESPONSE_CRYPTO_FALLBACK_SECRET;
const responseKeySeed = import.meta.env.VITE_API_RESPONSE_CRYPTO_KEY || responseSecret;
const responseIvSeed = import.meta.env.VITE_API_RESPONSE_CRYPTO_IV || `${responseSecret}:iv`;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

async function sha256Bytes(value) {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', encoder.encode(String(value)));
  return new Uint8Array(digest);
}

async function getAesKey(seed = responseKeySeed) {
  const hash = await sha256Bytes(seed);

  return globalThis.crypto.subtle.importKey('raw', hash.slice(0, 32), { name: 'AES-CBC' }, false, [
    'encrypt',
    'decrypt',
  ]);
}

async function getIv(seed = responseIvSeed) {
  const hash = await sha256Bytes(seed);
  return hash.slice(0, 16);
}

function base64ToBytes(value) {
  const binary = globalThis.atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function bytesToBase64(bytes) {
  let binary = '';

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return globalThis.btoa(binary);
}

export async function encryptJson(payload) {
  const key = await getAesKey();
  const iv = await getIv();
  const encrypted = await globalThis.crypto.subtle.encrypt(
    { name: 'AES-CBC', iv },
    key,
    encoder.encode(JSON.stringify(payload)),
  );

  return `${JSON_PREFIX}${bytesToBase64(new Uint8Array(encrypted))}`;
}

export async function decryptJson(payload) {
  const value = String(payload ?? '');

  if (!value.startsWith(JSON_PREFIX)) {
    return JSON.parse(value);
  }

  if (!globalThis.crypto?.subtle) {
    throw new Error('Browser tidak mendukung decrypt response terenkripsi.');
  }

  const key = await getAesKey();
  const iv = await getIv();
  const decrypted = await globalThis.crypto.subtle.decrypt(
    { name: 'AES-CBC', iv },
    key,
    base64ToBytes(value.slice(JSON_PREFIX.length)),
  );

  return JSON.parse(decoder.decode(decrypted));
}

export async function decryptResponseField(value) {
  if (value === null || value === undefined) {
    return value;
  }

  return decryptJson(value);
}
