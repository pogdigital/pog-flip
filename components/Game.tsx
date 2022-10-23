import { FlipGameState, PogMintAddress } from '@/lib/flipgame';
import { PogView } from './PogView';
import { PogNFT } from '@/lib/nft';

export function Game({
  gameState,
  playerPog,
  winningPog,
  onPlayGame,
  onRestartGame,
}: {
  gameState: FlipGameState;
  playerPog: PogNFT | null;
  winningPog: PogMintAddress | null;
  onPlayGame: () => {};
  onRestartGame: () => {};
}) {
  return (
    <div className="flex flex-col w-full sm:flex-row">
      <div className="border-2 text-center text-2xl p-8 bg-blue-500 rounded-2xl flex w-full justify-center text-white">
        {gameState == FlipGameState.GameFinished && (
          <div>
            <div className="flex-grow text-center text-2xl p-6 rounded-2xl flex items-center">
              {gameState == FlipGameState.GameFinished && winningPog && (
                <div>
                  <div className="mb-4">Winner!</div>

                  <PogView
                    name="Winner"
                    mintAddress={winningPog}
                    imageUrl={''}
                  />
                </div>
              )}

              {gameState == FlipGameState.GameFinished && winningPog === null && (
                <div>
                  {' '}
                  <div className="mb-4">Game over.</div>
                  Pogman was triumphant!
                  <div className="mt-6 w-60 h-60 border text-center align-middle">
                    [pic of pogman goes here]
                  </div>
                </div>
              )}
            </div>

            <button
              className="btn btn-lg bg-primary mt-6"
              onClick={() => {
                onRestartGame();
              }}
            >
              Play again?
            </button>
          </div>
        )}
        {gameState == FlipGameState.AwaitPlayerPog && (
          <div className="text-base-100">
            Please choose a Pog from your wallet to play with.
          </div>
        )}
        {gameState == FlipGameState.PogPicked ||
          (gameState == FlipGameState.GameStarted && (
            <div className="mt-8">
              {playerPog && (
                <PogView
                  name={playerPog.name}
                  mintAddress={playerPog.mintAddress}
                  imageUrl={playerPog.imageUrl}
                />
              )}
            </div>
          ))}
      </div>
      {gameState == FlipGameState.PogPicked ||
        (gameState == FlipGameState.GameStarted && (
          <div className="text-center">
            <div className="flex flex-col h-full justify-center">
              <div>
                <button
                  className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full m-10"
                  onClick={() => {
                    onPlayGame();
                  }}
                >
                  FLIP!
                </button>
                <div className="text-xl pl-5 pr-5 pb-10">
                  You have a 50% change of losing your Pog, or earning one from
                  Pogman!
                </div>
                <div>
                  Pressing Flip will transfer your Pog NFT out of your wallet to
                  start the game.
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
