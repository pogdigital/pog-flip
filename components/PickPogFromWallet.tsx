import { PogNFT } from '@/lib/nft';

export function PickPogFromWallet({ pogs }: { pogs: PogNFT[] }) {
  if (pogs.length === 0) {
    return <div>Please add some Pogs to your wallet to play.</div>;
  }
  return (
    <div className="mx-auto">
      <h1 className="mt-8">NFTs in Your Wallet</h1>
      <div className="flex flex-row">
        {pogs.map((pog) => {
          return (
            <img
              key={pog.imageUrl}
              src={pog.imageUrl}
              width="256"
              height="256"
              className="rounded-full mx-auto"
              alt=""
            />
          );
        })}
      </div>
    </div>
  );
}
