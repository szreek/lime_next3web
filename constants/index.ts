  export interface Networks {
    [key: number]: string;
  }
  export const walletConnectSupportedNetworks: Networks = {
    // Add your network rpc URL here
    1: 'https://goerli.infura.io/v3/4d5caad6cbc645eba02a8cd5dc0036bb'
  };

  // Network chain ids
  export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

  export const ALBT_TOKEN_ADDRESS = '0xb2Cb8eEB2DBcdeB0B47e3E5dB55a902C7B5C5C07';
  export const LIBRARY_ADDRESS = '0x7b5c69876Acf21250737A15b9f65B9A6862984B7';