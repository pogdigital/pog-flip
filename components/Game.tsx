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
      <div className="border-2 text-center text-2xl p-8 bg-blue-500 rounded-2xl flex items-center">
        {gameState == FlipGameState.GameFinished && (
          <div>
            Game over.{' '}
            <button
              className="btn btn-lg bg-primary"
              onClick={() => {
                onRestartGame();
              }}
            >
              Play again?
            </button>
          </div>
        )}
        {gameState == FlipGameState.AwaitPlayerPog && (
          <div className="text-base-300">
            Please connect and choose a Pog from your wallet.
          </div>
        )}
        {gameState == FlipGameState.PogPicked && (
          <div className="mt-8">
            {playerPog && (
              <PogView
                name={playerPog.name}
                mintAddress={playerPog.mintAddress}
                imageUrl={playerPog.imageUrl}
              />
            )}
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="flex flex-col h-full">
          <div className="flex-grow">&nbsp;</div>
          <div>
            <button
              disabled={gameState !== FlipGameState.PogPicked}
              className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full m-10"
              onClick={() => {
                onPlayGame();
              }}
            >
              FLIP
            </button>
          </div>
          <div className="flex-grow">&nbsp;</div>
        </div>
      </div>
      {gameState == FlipGameState.GameFinished && winningPog && (
        <div className="flex-grow border-2 text-center text-2xl p-8 rounded-2xl">
          {/* <div>Winner</div> */}

          {gameState == FlipGameState.GameFinished && (
            <div className="mt-8">
              <PogView name="Winner" mintAddress={winningPog} imageUrl={''} />
            </div>
          )}
        </div>
      )}
      {gameState == FlipGameState.GameFinished && winningPog === null && (
        <div className="flex-grow border-2 text-center text-2xl p-8 rounded-2xl flex items-center">
          <div>Better Luck Next Time!</div>
        </div>
      )}
    </div>
  );
}
