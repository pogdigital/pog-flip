import { PublicKey } from '@solana/web3.js';

export interface WalletAndNetwork {
  publicKey: PublicKey;
  endpoint: string;
}
