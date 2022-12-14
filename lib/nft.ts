import axios from 'axios';
import {
  createConnectionConfig,
  getParsedNftAccountsByOwner,
} from '@nfteyez/sol-rayz';

import { WalletAndNetwork } from '@/types/index';
import { PogMintAddress } from './flipgame';

interface NFT {
  data: {
    name: string;
    uri: string;
  };
}

interface NFTMetadata {
  isPog: boolean;
  name: string;
  imageUrl: string;
}

interface PogNFT {
  name: string;
  imageUrl: string;
  mintAddress: PogMintAddress;
}

async function fetchNFTMetadata(nft: NFT): Promise<NFTMetadata> {
  const uri = nft.data.uri;
  const metadata = await axios({
    url: uri,
    method: 'get',
  });

  return {
    isPog:
      metadata?.data?.properties?.creators &&
      metadata.data.properties.creators[0].address ===
        'BrtiXxJN5H7zoLyAsucBuymAgpYH8zRcR3NiQuyP9mPL',
    name: metadata.data.name,
    imageUrl: metadata.data.image,
  };
}

async function getNFTs({
  publicKey,
  endpoint,
}: WalletAndNetwork): Promise<PogNFT[]> {
  const publicAddress = publicKey.toBase58();

  try {
    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
      connection: createConnectionConfig(endpoint, 'processed'),
    });

    const pogs: PogNFT[] = [];
    for (let i = 0; i < nftArray.length; i++) {
      const { isPog, name, imageUrl } = await fetchNFTMetadata(nftArray[i]);
      if (isPog) {
        pogs.push({
          name,
          imageUrl,
          mintAddress: nftArray[i].mint,
        } as PogNFT);
      }
    }
    return pogs;
  } catch (e) {
    if (e instanceof Error) {
      console.log('Error thrown, while fetching NFTs', e.message);
    }
  }
  return [];
}

export { type PogNFT, getNFTs };
