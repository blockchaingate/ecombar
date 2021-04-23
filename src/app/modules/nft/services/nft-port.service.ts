import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { OpenSeaPort, Network } from '../../../../../../nft-js';
import { Web3Service } from '../../shared/services/web3.service';
import { KanbanService } from '../../shared/services/kanban.service';
import { NftOrder } from '../models/nft-order';
//const Network = opensea.Network;
const nullAddress = '0x0000000000000000000000000000000000000000';
const nullBytes = '0x00';
@Injectable({ providedIn: 'root' })
export class NftPortService {

  constructor(private kanbanServ: KanbanService, private web3Serv: Web3Service) {

  }
  
  createBuyOrder(taker: string, sellOrder: NftOrder) {
    const order = sellOrder;
    order.taker = taker;
    return order;
  }

  recoverAddress(hash, v, r, s) {
    const args = [hash, v, r ,s];
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "hash",
          "type": "bytes32"
        },
        {
          "name": "v",
          "type": "uint8"
        },
        {
          "name": "r",
          "type": "bytes32"
        },
        {
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "recoverAddressTest",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
    return this.web3Serv.getGeneralFunctionABI(abi, args);
  }

  async getOrderSignature(order: NftOrder, privateKey: any) {
    const hashToSignABI = this.hashToSign(order);

    const res =  await this.kanbanServ.kanbanCall(order.exchange, hashToSignABI);

    const hash = res.data;
    
    const hashForSignature = this.web3Serv.hashKanbanMessage(hash);

    console.log('final hash=', hash);
    const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);    

    return signature;
  }

  hashToSign(order: NftOrder) {
    const args = [
      [
        order.exchange??nullAddress, order.maker??nullAddress, order.taker??nullAddress,  
        order.feeRecipient??nullAddress,order.target??nullAddress,order.staticTarget??nullAddress
      ],
      [
        order.makerRelayerFee, order.takerRelayerFee, order.makerProtocolFee, 
        order.takerProtocolFee, order.coinType, order.basePrice, order.extra, 
        order.listingTime, order.expirationTime, order.salt
      ],
      order.feeMethod,
      order.side,
      order.saleKind,
      order.howToCall,
      Buffer.from(order.calldata.replace('0x', ''), 'hex'),
      Buffer.from(order.replacementPattern.replace('0x', ''), 'hex'),
      order.staticExtradata??nullBytes      
    ];

    console.log('final args=', args);
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "addrs",
          "type": "address[6]"
        },
        {
          "name": "uints",
          "type": "uint256[10]"
        },
        {
          "name": "feeMethod",
          "type": "uint8"
        },
        {
          "name": "side",
          "type": "uint8"
        },
        {
          "name": "saleKind",
          "type": "uint8"
        },
        {
          "name": "howToCall",
          "type": "uint8"
        },
        {
          "name": "calldata",
          "type": "bytes"
        },
        {
          "name": "replacementPattern",
          "type": "bytes"
        },
        {
          "name": "staticExtradata",
          "type": "bytes"
        }
      ],
      "name": "hashToSign_",
      "outputs": [
        {
          "name": "",
          "type": "bytes32"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    return this.web3Serv.getGeneralFunctionABI(abi, args);
  }

  atomicMatch(sell: NftOrder, buy: NftOrder, metadata) {
    const args = [
      [
        buy.exchange, buy.maker, buy.taker, buy.feeRecipient, 
        buy.target,buy.staticTarget, sell.exchange, sell.maker, 
        sell.taker, sell.feeRecipient,sell.target, sell.staticTarget
      ],
      [
        buy.makerRelayerFee, buy.takerRelayerFee, buy.makerProtocolFee, 
        buy.takerProtocolFee, buy.coinType, buy.basePrice, buy.extra, 
        buy.listingTime, buy.expirationTime, buy.salt, 
        sell.makerRelayerFee, sell.takerRelayerFee, sell.makerProtocolFee, 
        sell.takerProtocolFee, sell.coinType, sell.basePrice, sell.extra, 
        sell.listingTime, sell.expirationTime, sell.salt
      ],
      [
        buy.feeMethod, buy.side, buy.saleKind, buy.howToCall, 
        sell.feeMethod, sell.side, sell.saleKind, sell.howToCall
      ],
      buy.calldata,
      sell.calldata,
      buy.replacementPattern,
      sell.replacementPattern,
      buy.staticExtradata,
      sell.staticExtradata,
      [
        buy.v,
        sell.v
      ],
      [
        buy.r,
        buy.s,
        sell.r,
        sell.s,
        metadata
      ]
    ];

    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "addrs",
          "type": "address[12]"
        },
        {
          "name": "uints",
          "type": "uint256[20]"
        },
        {
          "name": "feeMethodsSidesKindsHowToCalls",
          "type": "uint8[8]"
        },
        {
          "name": "calldataBuy",
          "type": "bytes"
        },
        {
          "name": "calldataSell",
          "type": "bytes"
        },
        {
          "name": "replacementPatternBuy",
          "type": "bytes"
        },
        {
          "name": "replacementPatternSell",
          "type": "bytes"
        },
        {
          "name": "staticExtradataBuy",
          "type": "bytes"
        },
        {
          "name": "staticExtradataSell",
          "type": "bytes"
        },
        {
          "name": "vs",
          "type": "uint8[2]"
        },
        {
          "name": "rssMetadata",
          "type": "bytes32[5]"
        }
      ],
      "name": "atomicMatch_",
      "outputs": [],
      "payable": true,
      "stateMutability": "payable",
      "type": "function"
    };

    return this.web3Serv.getGeneralFunctionABI(abi, args);
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
    const order = new NftOrder(exchange, maker, null, makerRelayerFee, 
    0, 0, 0, feeRecipient, feeMethod, side, saleKind, smartContractAddress, howToCall,
    callData, replacementPattern, null, null, coinType, price, 0, listingTime, 
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