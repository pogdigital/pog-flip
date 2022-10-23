import type { NextPage } from 'next';
import Head from 'next/head';
import { clusterApiUrl } from '@solana/web3.js';
import {
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@solana/wallet-adapter-base';
import { PickPogFromWallet } from '@/components/PickPogFromWallet';
import { useMemo, useEffect, useState } from 'react';
import { PogNFT, getNFTs } from '@/lib/nft';
import { Game } from '@/components/Game';
import { FlipGame, FlipGameState } from '@/lib/flipgame';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from '@solana/wallet-adapter-react-ui';

const game = new FlipGame();

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const { connection } = useConnection();
  const { publicKey, sendTransaction, wallet } = useWallet();

  const [nfts, setNfts] = useState<PogNFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false);

  const [gameState, setGameState] = useState<FlipGameState>(
    FlipGameState.AwaitPlayerPog
  );
  const [playerPog, setPlayerPog] = useState<PogNFT | null>(null);
  const [winningPog, setWinningPog] = useState<string | null>(null);

  async function initGame() {
    setWinningPog(null);
    const pog = await game.getPogInProgress({
      browserStorage: window.sessionStorage,
    });
    console.log('POG IN PROGRESS', pog);
    if (pog) {
      setGameState(FlipGameState.GameStarted);
      setPlayerPog(pog);
    } else {
      setGameState(FlipGameState.AwaitPlayerPog);
      setPlayerPog(null);
    }
  }

  function onSelectPog(pog: PogNFT): void {
    setPlayerPog(pog);
    setGameState(FlipGameState.PogPicked);
  }

  useEffect(() => {
    async function init() {
      if (!wallet) {
        await initGame();
      }
    }
    init();
  }, [wallet]);

  async function onPlayGame() {
    if (!publicKey || !sendTransaction) throw new WalletNotConnectedError();
    if (playerPog?.mintAddress && publicKey) {
      setGameState(FlipGameState.GameStarted);

      if (
        !(await game.getPogInProgress({
          browserStorage: window.sessionStorage,
        }))
      ) {
        await game.stepOneTransferPlayerPog({
          connection,
          publicKey,
          sendTransaction,
          playerPog,
          browserStorage: window.sessionStorage,
        });
      }

      await game.stepTwoTransferPogmanPog({ playerPog });

      const result = await game.stepThreeResults({
        playerPogMintAddress: playerPog.mintAddress,
      });

      // TODO: When game is officially over
      // setWinningPog(result.winningPogMintAddress);
      // setGameState(FlipGameState.GameFinished);
      // game.clearPogInProgress()
    }
  }

  async function onRestartGame() {
    await initGame();
  }

  useEffect(() => {
    async function retrieveNFTs() {
      if (publicKey) {
        setLoadingNFTs(true);
        setNfts(await getNFTs({ publicKey, endpoint }));
      }
    }
    retrieveNFTs();
  }, [publicKey, endpoint]);

  useEffect(() => {
    setLoadingNFTs(false);
  }, [nfts]);

  return (
    <div className="flex h-screen">
      <Head>
        <title>Play Pog Flip</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-screen h-screen p-4">
        <div className="flex justify-end mb-4">
          <div>&nbsp;</div>
          <div>
            <div className="flex gap-2">
              <div>&nbsp;</div>
              <div className="bg-blue-500 rounded">
                <WalletMultiButton />
              </div>
              {wallet && (
                <div className="bg-blue-500 rounded">
                  <WalletDisconnectButton />
                </div>
              )}
              <div className="badge badge-accent badge-outline flex-none">
                devnet
              </div>
            </div>
          </div>
        </div>

        {!wallet && (
          <div className="border-2 text-center text-2xl p-8 bg-blue-500 rounded-2xl flex w-full justify-center text-white">
            Please connect with your Phantom wallet.
          </div>
        )}
        {wallet && (
          <Game
            gameState={gameState}
            playerPog={playerPog}
            winningPog={winningPog}
            onPlayGame={onPlayGame}
            onRestartGame={onRestartGame}
          />
        )}

        {publicKey && gameState == FlipGameState.AwaitPlayerPog && (
          <div>
            {loadingNFTs ? (
              <progress className="progress w-full" />
            ) : nfts.length > 0 ? (
              <PickPogFromWallet onSelectPog={onSelectPog} pogs={nfts} />
            ) : (
              <div className="text-center mt-4">
                No Pogs to Play. Please add some Pogs to your wallet.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
