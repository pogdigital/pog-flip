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
    <div className="flex w-full flex-row flex-wrap justify-center gap-4">
      {pogs.map((pog) => {
        return (
          <PogView
            key={pog.mintAddress}
            name={pog.name}
            mintAddress={pog.mintAddress}
            imageUrl={pog.imageUrl}
            onSelectPog={onSelectPog}
          />
        );
      })}
    </div>
  );
}
