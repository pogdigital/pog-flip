/*
Game loop:

1. init -- user picks a Pog to play with
2. play -- start game, results are returned
3. display result (win or loss, and which Pog is earned or lost)
*/

const POGFLIP_ESCROW = '2HfWgU9nkwdBLFJ7s1UW4PBwgkgB16h7boXyGKNBZypB';
const REX_API_BASEURL = 'https://api.r3x.tech';

import * as web3 from '@solana/web3.js';
import axios from 'axios';
import type { WalletAdapterProps } from '@solana/wallet-adapter-base';
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from '@solana/spl-token';

import { PogNFT } from './nft';

export type PogMintAddress = string;

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

export interface Step2Results {
  pogmanMintAddress: PogMintAddress;
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

  async stepTwoTransferPogmanPog({
    playerPog,
    publicKey,
  }: {
    playerPog: PogNFT;
    publicKey: web3.PublicKey;
  }): Promise<Step2Results> {
    const mintPublicKey = new web3.PublicKey(playerPog.mintAddress);
    const to = new web3.PublicKey(POGFLIP_ESCROW);
    const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, to);

    console.log({
      userwalletaddress: publicKey.toString(),
      usertokenaddress: toTokenAccount.toString(),
    });

    const result = await axios({
      method: 'post',
      url: `${REX_API_BASEURL}/pogs/transfer-pog-to-escrow`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userwalletaddress: publicKey.toString(),
        usertokenaddress: toTokenAccount.toString(),
      },
    });

    console.log('Step 2 RESULT', result);

    const pogmanMintAddress = result.data.pogtokenaddress;
    console.log(`Pogman's Pog moved into escrow: ${pogmanMintAddress}`);
    return { pogmanMintAddress };
  }

  async stepThreeResults({
    pogmanMintAddress,
    publicKey,
  }: {
    pogmanMintAddress: PogMintAddress;
    publicKey: web3.PublicKey;
  }): Promise<PogFlipResults> {
    const mintPublicKey = new web3.PublicKey(pogmanMintAddress);
    const to = publicKey;
    const toTokenAccount = await getAssociatedTokenAddress(mintPublicKey, to);

    console.log({
      userwalletaddress: publicKey.toString(),
      usertokenaddress: toTokenAccount.toString(),
    });

    const result = await axios({
      method: 'post',
      url: `${REX_API_BASEURL}/pogs/transfer-pog-from-escrow`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        userwalletaddress: publicKey.toString(),
        usertokenaddress: toTokenAccount.toString(),
        pogtokenaddress: pogmanMintAddress,
      },
    });

    console.log('Step 3 RESULT', result);

    let winningPogMintAddress: string | null = null;

    interface OutcomeResult {
      outcome: boolean;
      usertokenaddress: string;
      tx1: string;
    }

    const data = result.data as OutcomeResult;

    if (data.outcome) {
      console.log('WINNER');
      winningPogMintAddress = data.usertokenaddress;
    } else {
      console.log('LOSER');
    }

    return {
      winningPogMintAddress,
    };
  }
}
