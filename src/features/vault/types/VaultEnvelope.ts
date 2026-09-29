export type VaultEnvelope = {
  version: 1;
  kind: "dashboard-pc-vault";
  kdf: "PBKDF2";
  hash: "SHA-256";
  iterations: number;
  salt: string;
  iv: string;
  ciphertext: string;
};
