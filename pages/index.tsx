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

  function onSelectPog(pog: PogNFT): void {
    setPlayerPog(pog);
    setGameState(FlipGameState.PogPicked);
  }

  useEffect(() => {
    if (!wallet) {
      setNfts([]);
      setPlayerPog(null);
      setGameState(FlipGameState.AwaitPlayerPog);
    }
  }, [wallet]);

  async function onPlayGame() {
    if (!publicKey || !sendTransaction) throw new WalletNotConnectedError();
    if (playerPog?.mintAddress && publicKey) {
      setGameState(FlipGameState.GameStarted);
      const result = await game.play({
        connection,
        publicKey,
        sendTransaction,
        playerPogMintAddress: playerPog.mintAddress,
      });
      setWinningPog(result.winningPogMintAddress);
      setGameState(FlipGameState.GameFinished);
    }
  }

  async function onRestartGame() {
    setGameState(FlipGameState.AwaitPlayerPog);
    setPlayerPog(null);
    setWinningPog(null);
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
        <div className="flex justify-center align-items mb-4">
          <div className="rounded bg-gray-500">
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <div>
            <label htmlFor="my-modal-3" className="btn modal-button m-1">
              <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="none"
                  stroke="#000"
                  strokeWidth="2"
                  d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,10 L12,18 M12,6 L12,8"
                />
              </svg>
            </label>

            <input type="checkbox" id="my-modal-3" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box relative">
                <label
                  htmlFor="my-modal-3"
                  className="btn btn-sm btn-circle absolute right-2 top-2"
                >
                  ✕
                </label>
                <h3 className="text-lg font-bold">Notes</h3>
                <p className="py-4">
                  While in early development this game is running on Solana
                  devnet, with support for Phantom wallet initially.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Game
          gameState={gameState}
          playerPog={playerPog}
          winningPog={winningPog}
          onPlayGame={onPlayGame}
          onRestartGame={onRestartGame}
        />

        {publicKey && (
          <div>
            <h1 className="mt-8 text-center text-3xl">NFTs in Your Wallet</h1>
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
