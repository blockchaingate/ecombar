import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OpenSeaPort, Network } from '../../../../../../nft-js';
import { Web3Service } from '../../shared/services/web3.service';
import { NftOrder } from '../models/nft-order';
//const Network = opensea.Network;
@Injectable({ providedIn: 'root' })
export class NftPortService {

  constructor(private web3Serv: Web3Service) {

  }
  
  createSellOrder(
    maker: string, 
    smartContractAddress: string, 
    tokenId: string, 
    coinType: number,
    price: number,
    makerRelayerFee: number) {
    const exchange = '0xbfdee10992140b342683837468eb24a728fe7c6b';

    const feeRecipient = '0x0000000000000000000000000000000000000FEE';
    const feeMethod = 0;
    const side = 1;
    const saleKind = 0;
    const howToCall = 0;
    const callData = '0x23b872dd' // - function signature for transfer, based on what function you use
    + '000000000000000000000000d46d7e8d5a9f482aeeb0918bef6a10445159f297'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + tokenId;
    const replacementPattern = '0x00000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    + '0000000000000000000000000000000000000000000000000000000000000000';

    const listingTime = Date.now();
    const salt = 1;
    const order = new NftOrder(exchange, maker, '', makerRelayerFee, 
    0, 0, 0, feeRecipient, feeMethod, side, saleKind, smartContractAddress, howToCall,
    callData, replacementPattern, '', '', coinType, price, 0, listingTime, 
    listingTime + 10000, salt);

    return order;
    /*
    const providerEngine = this.web3Serv.getProvider();
    const API_KEY = '';
    const OWNER_ADDRESS = '0x0Bf2B5631f172CD5DcEBf1361bB42aCF07Ed29A9';

    const seaport = new OpenSeaPort(
      providerEngine,
      {
        apiBaseUrl: environment.endpoints.blockchaingate,
        networkName: Network.Rinkeby,
        apiKey: API_KEY,
      },
      (arg) => console.log(arg)
    );  

    console.log('seaport=', seaport);
    console.log('222');
    const fixedPriceSellOrder = await seaport.createSellOrder({
      asset: {
        tokenId: tokenId,
        tokenAddress: smartContractAddress,
      },
      startAmount: 0.05,
      expirationTime: 0,
      accountAddress: OWNER_ADDRESS,
    });
    console.log(
      `Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}\n`
    );    
    */
  }

}