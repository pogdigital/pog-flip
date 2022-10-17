/*
Game loop:

1. init -- user picks a Pog to play with
2. play -- start game, results are returned
3. display result (win or loss, and which Pog is earned or lost)
*/

export type PogMintAddress = string | null;

export enum FlipGameState {
  AwaitPlayerPog,
  PogPicked,
  GameStarted,
  GameFinished,
}

export interface PogFlipParams {
  playerPogMintAddress: PogMintAddress;
}

export interface PogFlipResults {
  winningPogMintAddress: PogMintAddress | null;
}

export class FlipGame {
  async play({ playerPogMintAddress }: PogFlipParams): Promise<PogFlipResults> {
    // mock game logic - flip and then return winning mintAddress or null for a loss
    const win = Math.random() < 0.5;
    return win
      ? {
          winningPogMintAddress: '5cWmE1KMdGt5tSj4jadieUKqJRFm25zKxYMAZ8MzV5a7',
        }
      : { winningPogMintAddress: null };
  }
}
