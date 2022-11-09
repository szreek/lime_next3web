const { GOERLI_URL, PUBLIC_KEY_LOCAL, USELECTION_CONTRACT_ADDRESS } = process.env;

  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: GOERLI_URL
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

  export const ALBT_TOKEN_ADDRESS = PUBLIC_KEY_LOCAL;
  export const US_ELECTION_ADDRESS = USELECTION_CONTRACT_ADDRESS;