import axios from 'axios';
import {
  createConnectionConfig,
  getParsedNftAccountsByOwner,
} from '@nfteyez/sol-rayz';

import { WalletAndNetwork } from '@/types/index';

interface NFT {
  data: {
    name: string;
    uri: string;
  };
}

interface NFTMetadata {
  name: string;
  imageUrl: string;
}

interface PogNFT {
  name: string;
  imageUrl: string;
  mintAddress: string;
}

async function fetchNFTMetadata(nft: NFT): Promise<NFTMetadata> {
  const uri = nft.data.uri;
  const metadata = await axios({
    url: uri,
    method: 'get',
  });

  return {
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
      const { name, imageUrl } = await fetchNFTMetadata(nftArray[i]);
      pogs.push({
        name,
        imageUrl,
        mintAddress: nftArray[i].mint,
      } as PogNFT);
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
