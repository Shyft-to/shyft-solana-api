import { clusterApiUrl } from '@solana/web3.js';
import axios from 'axios';
import { Network } from 'src/dto/netwotk.dto';

const endpoint = {
  http: {
    devnet: 'http://api.devnet.solana.com',
    testnet: 'http://api.testnet.solana.com',
    'mainnet-beta': 'http://api.mainnet-beta.solana.com/'
  },
  https: {
    devnet: 'https://broken-polished-dew.solana-devnet.discover.quiknode.pro/44ee984c6efc5b1e98c12010b70bb2342ab19c7d/',
    testnet: 'https://api.testnet.solana.com',
    'mainnet-beta': 'https://broken-hidden-pond.solana-mainnet.discover.quiknode.pro/a9443ebc1be769c64ae5364f8dc72762d37461cd/',
  }
};

export const Utility = {
  request: async function (uri: string): Promise<any> {
    try {
      const res = await axios.get(uri);
      return res.status === 200 ? res.data : {};
    } catch (error) {
      throw error;
    }
  },

  clusterUrl: function (network: Network): string {
    try {
      switch (network) {
        case Network.devnet:
          return endpoint.https.devnet;
        case Network.mainnet:
          return endpoint.https['mainnet-beta'];
        default:
          return clusterApiUrl(network);
      }
    } catch (error) {
      throw error;
    }
  },

};
