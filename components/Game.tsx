import Image from 'next/image';
import { FlipGameState } from '@/lib/flipgame';
import { PogView } from './PogView';
import { PogNFT } from '@/lib/nft';

export function Game({
  gameState,
  playerPog,
}: {
  gameState: FlipGameState;
  playerPog: PogNFT | null;
}) {
  return (
    <div className="flex flex-col w-full sm:flex-row">
      <div className="border-2 text-center text-2xl p-8 bg-blue-500 rounded-2xl">
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
              disabled
              className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full m-10"
            >
              FLIP
            </button>
          </div>
          <div className="flex-grow">&nbsp;</div>
        </div>
      </div>
      <div className="flex-grow border-2 text-center text-2xl p-8">
        <div>Result</div>

        {gameState == FlipGameState.GameFinished && (
          <div className="mt-8">
            <Image
              src="https://arweave.net/KPtfLSz8u5cwvkUt9bYGSuErJFYuZz84cWfZYZ0Nfu4?ext=png"
              width="256"
              height="256"
              alt=""
              className="rounded-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}
