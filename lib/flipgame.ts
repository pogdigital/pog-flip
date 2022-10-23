/*
Game loop:

1. init -- user picks a Pog to play with
2. play -- start game, results are returned
3. display result (win or loss, and which Pog is earned or lost)
*/

const POGFLIP_ESCROW = '2HfWgU9nkwdBLFJ7s1UW4PBwgkgB16h7boXyGKNBZypB';

import * as web3 from '@solana/web3.js';
import type { WalletAdapterProps } from '@solana/wallet-adapter-base';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

import { PogNFT } from './nft';

export type PogMintAddress = string | null;

export enum FlipGameState {
  AwaitPlayerPog,
  PogPicked,
  GameStarted,
  GameFinished,
}

export interface PogFlipStepOneParams {
  connection: web3.Connection;
  publicKey: web3.PublicKey;
  sendTransaction: WalletAdapterProps['sendTransaction'];
  playerPog: PogNFT;
  browserStorage: Storage;
}

export interface PogFlipResults {
  winningPogMintAddress: PogMintAddress | null;
}

export class FlipGame {
  async getPogInProgress({
    browserStorage,
  }: {
    browserStorage: Storage;
  }): Promise<PogNFT | null> {
    const playerPogGameInProgress = browserStorage.getItem('playerPog');
    if (playerPogGameInProgress) {
      return JSON.parse(playerPogGameInProgress);
    }
    return null;
  }

  async setPogInProgress({
    browserStorage,
    playerPog,
  }: {
    browserStorage: Storage;
    playerPog: PogNFT;
  }): Promise<void> {
    if (playerPog) {
      browserStorage.setItem('playerPog', JSON.stringify(playerPog));
    } else {
      throw new Error('Missing playerPog');
    }
  }

  async clearPogInProgress({
    browserStorage,
  }: {
    browserStorage: Storage;
  }): Promise<void> {
    browserStorage.removeItem('playerPog');
  }

  async stepOneTransferPlayerPog({
    connection,
    publicKey,
    sendTransaction,
    playerPog,
    browserStorage,
  }: PogFlipStepOneParams): Promise<void> {
    await this.playerPogToEscrow({
      connection,
      publicKey,
      sendTransaction,
      playerPog,
      browserStorage,
    });
  }

  // transfer player Pog into escrow wallet
  async playerPogToEscrow({
    connection,
    publicKey,
    sendTransaction,
    playerPog,
    browserStorage,
  }: PogFlipStepOneParams): Promise<void> {
    if (playerPog && playerPog.mintAddress) {
      const mintPublicKey = new web3.PublicKey(playerPog.mintAddress);
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

      let tx = new web3.Transaction().add(
        createAssociatedTokenAccountInstruction(
          publicKey,
          toTokenAccount,
          to,
          mintPublicKey
        )
      );

      tx.add(
        createTransferCheckedInstruction(
          fromTokenAccount,
          mintPublicKey,
          toTokenAccount,
          publicKey,
          1,
          0
        )
      );

      const result = await sendTransaction(tx, connection, {
        preflightCommitment: 'confirmed',
      });
      console.log(
        'result of createAssociatedTokenAccountInstruction and createTransferCheckedInstruction transaction',
        result
      );

      await this.setPogInProgress({ browserStorage, playerPog });
    }
  }

  async stepTwoTransferPogmanPog() {}

  async stepThreeResults({
    playerPogMintAddress,
  }: {
    playerPogMintAddress: PogMintAddress;
  }): Promise<PogFlipResults> {
    return {
      winningPogMintAddress: null,
    };
  }
}
