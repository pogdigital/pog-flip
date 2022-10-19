/*
Game loop:

1. init -- user picks a Pog to play with
2. play -- start game, results are returned
3. display result (win or loss, and which Pog is earned or lost)
*/

const POGFLIP_ESCROW = '2HfWgU9nkwdBLFJ7s1UW4PBwgkgB16h7boXyGKNBZypB';

import * as web3 from '@solana/web3.js';

import type {
  SignerWalletAdapterProps,
  WalletAdapterProps,
} from '@solana/wallet-adapter-base';

import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

export type PogMintAddress = string | null;

export enum FlipGameState {
  AwaitPlayerPog,
  PogPicked,
  GameStarted,
  GameFinished,
}

export interface PogFlipParams {
  connection: web3.Connection;
  publicKey: web3.PublicKey;
  sendTransaction: WalletAdapterProps['sendTransaction'];
  signTransaction: SignerWalletAdapterProps['signTransaction'] | undefined;
  playerPogMintAddress: PogMintAddress;
}

export interface PogFlipResults {
  winningPogMintAddress: PogMintAddress | null;
}

export class FlipGame {
  // play game
  async play({
    connection,
    publicKey,
    sendTransaction,
    signTransaction,
    playerPogMintAddress,
  }: PogFlipParams): Promise<PogFlipResults> {
    await this.playerPogToEscrow({
      connection,
      publicKey,
      sendTransaction,
      signTransaction,
      playerPogMintAddress,
    });

    // mock game logic - flip and then return winning mintAddress or null for a loss
    const win = Math.random() < 0.5;
    return win
      ? {
          winningPogMintAddress: '5cWmE1KMdGt5tSj4jadieUKqJRFm25zKxYMAZ8MzV5a7',
        }
      : { winningPogMintAddress: null };
  }

  // transfer player Pog into escrow wallet
  async playerPogToEscrow({
    connection,
    publicKey,
    sendTransaction,
    signTransaction,
    playerPogMintAddress,
  }: PogFlipParams): Promise<void> {
    if (playerPogMintAddress) {
      const mintPublicKey = new web3.PublicKey(playerPogMintAddress);
      const to = new web3.PublicKey(POGFLIP_ESCROW);

      const fromTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        publicKey
      );

      const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, to);

      console.log(
        'from, to',
        fromTokenAccount.toBase58(),
        toTokenAccount.toBase58()
      );

      let txCreate = new web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          toTokenAccount,
          to,
          mintPublicKey
        )
      );

      const createResult = await sendTransaction(txCreate, connection, {
        preflightCommitment: 'confirmed',
      });
      console.log('result of create associated account', createResult);

      const txTransfer = new web3.Transaction().add(
        createTransferCheckedInstruction(
          fromTokenAccount,
          mintPublicKey,
          toTokenAccount,
          publicKey,
          1,
          0
        )
      );

      const result = await sendTransaction(txTransfer, connection, {
        preflightCommitment: 'confirmed',
      });
      console.log('result of sendTransaction', result);
    }
  }
}
