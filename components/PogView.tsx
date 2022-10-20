import { PogNFT } from '@/lib/nft';
import { PogMintAddress } from '@/lib/flipgame';

interface PogViewParams {
  name: string;
  imageUrl: string;
  mintAddress: PogMintAddress;
  onSelectPog?: ({ name, mintAddress, imageUrl }: PogNFT) => void;
}

export function PogView({
  name,
  mintAddress,
  imageUrl,
  onSelectPog,
}: PogViewParams) {
  return (
    <div className="card md:w-60 bg-base-100 shadow-lg" key={mintAddress}>
      <figure className="px-10 pt-10">
        <img src={imageUrl} alt={name} className="rounded-xl" />
      </figure>
      <div className="card-body items-center text-center text-gray-500">
        <h2 className="card-title">{name}</h2>
        <p>
          <a
            className="underline"
            href={`https://solscan.io/token/${mintAddress}?cluster=devnet`}
            target="_blank"
            rel="noreferrer"
          >
            View on Solscan
          </a>
        </p>
        {onSelectPog && (
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => {
                onSelectPog({ name, mintAddress, imageUrl });
              }}
            >
              Play this Pog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
