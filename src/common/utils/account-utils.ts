import { Keypair } from '@solana/web3.js';
import * as bs58 from 'bs58';

export const AccountUtils = {
  getKeypair: function (privateKey: string): Keypair {
    const keypair = Keypair.fromSecretKey(bs58.decode(privateKey));
    return keypair;
  },
};
