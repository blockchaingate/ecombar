import { Injectable } from '@angular/core';
import { OpenSeaPort, Network } from '../../../../../../nft-js';
import { Web3Service } from '../../shared/services/web3.service';
//const Network = opensea.Network;
@Injectable({ providedIn: 'root' })
export class NftPortService {

  constructor(private web3Serv: Web3Service) {

  }
  async createSellOrder() {
    const providerEngine = this.web3Serv.getProvider();
    const API_KEY = '';
    const NFT_CONTRACT_ADDRESS = '0x351C9EbCE0c36a3BBd0568661d440b818a2D28a8';
    const OWNER_ADDRESS = '0x0Bf2B5631f172CD5DcEBf1361bB42aCF07Ed29A9';

    console.log('111');
    const seaport = new OpenSeaPort(
      providerEngine,
      {
        networkName: Network.Rinkeby,
        apiKey: API_KEY,
      },
      (arg) => console.log(arg)
    );  

    console.log('seaport=', seaport);
    console.log('222');
    const fixedPriceSellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: "1",
        tokenAddress: NFT_CONTRACT_ADDRESS,
      },
      startAmount: 0.05,
      expirationTime: 0,
      accountAddress: OWNER_ADDRESS,
    });
    console.log(
      `Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}\n`
    );    
    
  }

}