export type VaultSession = {
  iterations: number;
  key: CryptoKey;
  salt: Uint8Array;
};
