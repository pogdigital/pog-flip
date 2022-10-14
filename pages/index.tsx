import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PickPogFromWallet } from '@/components/PickPogFromWallet';
import { useMemo, useEffect, useState } from 'react';
import { PogNFT, getNFTs } from '@/lib/nft';
import { WalletMenu } from '@/components/WalletMenu';

const Home: NextPage = () => {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [nfts, setNfts] = useState<PogNFT[]>([]);
  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false);

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

      <main className="w-screen h-screen p-10">
        <div className="flex flex-col w-full sm:flex-row">
          <div className="flex-grow border-2 text-center text-2xl p-8">
            <div>Pogman</div>
            <div className="mt-8">
              <Image
                src="https://arweave.net/RwDeriud_rdVMyaNRA1IPeBbfLQFM0skY0Y32nXuCRM?ext=png"
                width="256"
                height="256"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex flex-col h-full">
              <div className="flex-grow">&nbsp;</div>
              <div>
                <button disabled className="btn btn-lg bg-primary hover:bg-primary-focus text-primary-content border-primary-focus border-4 h-36 w-36 rounded-full m-10">
                  FLIP
                </button>
              </div>
              <div className="flex-grow">&nbsp;</div>
            </div>
          </div>
          <div className="flex-grow border-2 text-center text-2xl p-8">
            <div>Player</div>

            <div className="flex justify-center align-items">
              <div>
                <WalletMenu
                  onWalletConnect={(publicKey) => {
                    setPublicKey(publicKey.publicKey);
                  }}
                  onWalletDisconnect={() => {
                    setPublicKey(null);
                    setNfts([]);
                  }}
                />
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

                <input
                  type="checkbox"
                  id="my-modal-3"
                  className="modal-toggle"
                />
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

            <div className="mt-8">
              <Image
                src="https://arweave.net/KPtfLSz8u5cwvkUt9bYGSuErJFYuZz84cWfZYZ0Nfu4?ext=png"
                width="256"
                height="256"
                alt=""
                className="rounded-full"
              />
            </div>
          </div>
        </div>
        {publicKey && (
          <div>
            <h1 className="mt-8 text-center text-3xl">NFTs in Your Wallet</h1>
            {loadingNFTs ? (
              <progress className="progress w-full" />
            ) : nfts.length > 0 ? (
              <PickPogFromWallet pogs={nfts} />
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
