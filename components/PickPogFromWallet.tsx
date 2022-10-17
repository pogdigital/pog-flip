import { PogNFT } from '@/lib/nft';
import { PogView } from '@/components/PogView';

interface PickPogParams {
  pogs: PogNFT[];
  onSelectPog: ({ name, mintAddress, imageUrl }: PogNFT) => void;
}

export function PickPogFromWallet({ onSelectPog, pogs }: PickPogParams) {
  if (pogs.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-row flex-wrap">
      {pogs.map((pog) => {
        return (
          <div key={pog.mintAddress} className="flex flex-col">
            <PogView
              name={pog.name}
              mintAddress={pog.mintAddress}
              imageUrl={pog.imageUrl}
              onSelectPog={onSelectPog}
            />
          </div>
        );
      })}
    </div>
  );
}
