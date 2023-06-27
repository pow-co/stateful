
interface Location {
  outpoint: string;
  block_height?: number;
  block_hash?: string;
  merkle_proof?: {
    blockHash: string;
    branches: {
      hash: string;
      pos: string;
    }[];
    hash: string;
    merkleRoot: string;
  };
}

interface FullObjectDetails {
  origin: string;
  code_part: string;
  abi: any;
  locations: Location[];
  destruction?: string;
}

export async function getFullObjectDetailsByLocation({ location }: { location: string }): Promise<FullObjectDetails> {

  return {
    origin: '',
    code_part: '',
    abi: {},
    locations: [] 
  }

}

