import { NetworkId } from '@synthetixio/contracts-interface';
import { Network } from 'store/wallet';

export const GWEI_UNIT = 1000000000;

export const INFURA_SUPPORTED_NETWORKS: Record<NetworkId, string> = {
	1: 'mainnet',
	5: 'goerli',
	10: 'optimism-mainnet',
	42: 'kovan',
	69: 'optimism-kovan',
	31337: 'mainnet-fork',
};

export const getInfuraRpcURL = (network: Network) => {
	return `https://${INFURA_SUPPORTED_NETWORKS[network.id]}.infura.io/v3/${
		process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
	}`;
};
