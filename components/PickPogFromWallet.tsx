import { PogNFT } from '@/lib/nft';

export function PickPogFromWallet({ pogs }: { pogs: PogNFT[] }) {
  if (pogs.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-row flex-wrap">
      {pogs.map((pog) => {
        return (
          <div
            className="card w-96 bg-base-100 shadow-xl"
            key={pog.mintAddress}
          >
            <figure className="px-10 pt-10">
              <img src={pog.imageUrl} alt={pog.name} className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">{pog.name}</h2>
              <p>
                <a
                  className="underline"
                  href={`https://solscan.io/token/${pog.mintAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Solscan
                </a>
              </p>
              <div className="card-actions">
                <button disabled className="btn btn-primary">
                  Play this Pog
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
