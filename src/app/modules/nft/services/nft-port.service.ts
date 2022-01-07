import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Web3Service } from '../../shared/services/web3.service';
import { KanbanService } from '../../shared/services/kanban.service';
import { NftOrder } from '../models/nft-order';
import { UtilService } from '../../shared/services/util.service';
import { Observable } from 'rxjs';
import BigNumber from 'bignumber.js/bignumber';

//const Network = opensea.Network;
const nullAddress = '0x0000000000000000000000000000000000000000';
const nullBytes = '0x00';
const nullBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000';
@Injectable({ providedIn: 'root' })
export class NftPortService {

  constructor(
    private utilServ: UtilService,
    private kanbanServ: KanbanService, 
    private web3Serv: Web3Service) {

  }
  
  createBuyOrder(taker: string, sellOrder: NftOrder) {
    console.log('1111');
    const order = sellOrder.clone();
    console.log('2222');
    order.tokenId = sellOrder.tokenId;
    order.maker = taker;
    order.side = 0;
    order.taker = sellOrder.maker;
    order.calldata = this.getTransferFromAbi(nullAddress, taker, sellOrder.tokenId);
    order.replacementPattern = '0x00000000'
      + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000';

    order.feeRecipient = null;
    return order;
  }

  createBuyOrderERC1155(taker: string, sellOrder: NftOrder) {

    const order = NftOrder.from(sellOrder);
    order.tokenId = sellOrder.tokenId;
    order.maker = taker;
    order.side = 0;
    order.amount = sellOrder.amount;
    order.taker = sellOrder.maker;
    order.calldata = this.getSafeTransferFromAbi(nullAddress, taker, sellOrder.tokenId, sellOrder.amount);

    order.replacementPattern = '0x00000000'
      + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000'
      + '0000000000000000000000000000000000000000000000000000000000000000';

    order.feeRecipient = null;
    return order;
  }

  createSellOrder(maker: string, buyOrder: NftOrder) {
    const order = buyOrder.clone();
    order.tokenId = buyOrder.tokenId;
    order.maker = maker;
    order.side = 1;
    order.taker = null;

    order.calldata = this.getTransferFromAbi(maker, nullAddress, buyOrder.tokenId);

    order.replacementPattern = '0x00000000'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
     + '0000000000000000000000000000000000000000000000000000000000000000';

    order.feeRecipient = '0x0000000000000000000000000000000000000FEE';
    return order;
  }

  createSellOrderERC1155(maker: string, buyOrder: NftOrder) {
    console.log('before createSellOrderERC1155=');
    console.log('maker==', maker);
    const order = buyOrder.clone();
    order.tokenId = buyOrder.tokenId;
    order.maker = maker;
    order.side = 1;
    order.amount = buyOrder.amount;
    order.taker = null;

    order.calldata = this.getSafeTransferFromAbi(maker, nullAddress, buyOrder.tokenId, buyOrder.amount);

    order.replacementPattern = '0x00000000'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + '0000000000000000000000000000000000000000000000000000000000000000'
     + '0000000000000000000000000000000000000000000000000000000000000000';

    order.feeRecipient = '0x0000000000000000000000000000000000000FEE';
    return order;
  }

  isProxyAuthenticated(address: string) {
    const kanbanAddress = this.utilServ.fabToExgAddress(address);
    const abi = this.getUserAuthenticatedAbi(kanbanAddress);

    const ret = new Observable<any>((observer) => {
      this.kanbanServ.kanbanCall(environment.addresses.smartContract.ProxyRegistry, abi)
      .subscribe(
          (res: any) => {
              console.log('res from kanbanCallkanbanCall=', res);
              const data = res.data;
              if(data == "0x0000000000000000000000000000000000000000000000000000000000000000") {
                observer.next(false);
              } else {
                observer.next(true);
              }
          }
      );
    });
    return ret;
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

    const res =  await this.kanbanServ.kanbanCallAsync(order.exchange, hashToSignABI);

    const hash = res.data;
    
    const hashForSignature = this.web3Serv.hashKanbanMessage(hash);
    const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey);    

    return {
      hash,
      hashForSignature,
      signature
    };
  }

  ordersCanMatch(buy: NftOrder, sell: NftOrder) {
    const args = [
      [
        buy.getExchange(), buy.getMaker(), buy.getTaker(), 
        buy.getFeeRecipient(), buy.getTarget(),buy.getStaticTarget(), 
        sell.getExchange(), sell.getMaker(), sell.getTaker(), 
        sell.getFeeRecipient(), sell.getTarget(), sell.getStaticTarget()
      ],
      [
        buy.getMakerRelayerFee(), buy.getTakerRelayerFee(), buy.getMakerProtocolFee(), 
        buy.getTakerProtocolFee(), buy.getCoinType(), buy.getBasePrice(), buy.getExtra(), 
        buy.getListingTime(), buy.getExpirationTime(), buy.getSalt(), 
        sell.getMakerRelayerFee(), sell.getTakerRelayerFee(), sell.getMakerProtocolFee(), 
        sell.getTakerProtocolFee(), sell.getCoinType(), sell.getBasePrice(), sell.getExtra(), 
        sell.getListingTime(), sell.getExpirationTime(), sell.getSalt()
      ],
      [
        buy.getFeeMethod(), buy.getSide(), buy.getSaleKind(), buy.getHowToCall(), 
        sell.getFeeMethod(), sell.getSide(), sell.getSaleKind(), sell.getHowToCall()
      ],
      Buffer.from(buy.getCalldata().replace('0x', ''), 'hex'),
      Buffer.from(sell.getCalldata().replace('0x', ''), 'hex'),
      Buffer.from(buy.getReplacementPattern().replace('0x', ''), 'hex'),
      Buffer.from(sell.getReplacementPattern().replace('0x', ''), 'hex'),
      buy.getStaticExtradata(),
      sell.getStaticExtradata()
    ];
    const abi = {
      "constant": true,
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
        }
      ],
      "name": "ordersCanMatch_",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };   

    const generalAbi = this.web3Serv.getGeneralFunctionABI(abi, args);
    return this.kanbanServ.kanbanCall(environment.addresses.smartContract.NFT_Exchange, generalAbi);
  }

  validateOrder(order: NftOrder) {
    const args = [
      [
        order.getExchange(), order.getMaker(), order.getTaker(),  
        order.getFeeRecipient(),order.getTarget(),order.getStaticTarget()
      ],
      [
        order.getMakerRelayerFee(), order.getTakerRelayerFee(), order.getMakerProtocolFee(), 
        order.getTakerProtocolFee(), order.getCoinType(), order.getBasePrice(), order.getExtra(), 
        order.getListingTime(), order.getExpirationTime(), order.getSalt()
      ],
      order.getFeeMethod(),
      order.getSide(),
      order.getSaleKind(),
      order.getHowToCall(),
      Buffer.from(order.calldata.replace('0x', ''), 'hex'),
      Buffer.from(order.replacementPattern.replace('0x', ''), 'hex'),
      order.getStaticExtradata(),
      order.getV(),
      order.getR(),
      order.getS()     
    ];
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
      "name": "validateOrder_",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };   

    const generalAbi = this.web3Serv.getGeneralFunctionABI(abi, args);
    return this.kanbanServ.kanbanCall(environment.addresses.smartContract.NFT_Exchange, generalAbi);
  }

  hashToSign(order: NftOrder) {
    let total = order.getBasePrice();
    if(order.amount) {
      total = new BigNumber(total).multipliedBy(order.amount).toFixed()
    }
    const args = [
      [
        order.getExchange(), order.getMaker(), order.getTaker(),  
        order.getFeeRecipient(),order.getTarget(),order.getStaticTarget()
      ],
      [
        order.getMakerRelayerFee(), order.getTakerRelayerFee(), order.getMakerProtocolFee(), 
        order.getTakerProtocolFee(), order.getCoinType(), total, order.getExtra(), 
        order.getListingTime(), order.getExpirationTime(), order.getSalt()
      ],
      order.getFeeMethod(),
      order.getSide(),
      order.getSaleKind(),
      order.getHowToCall(),
      Buffer.from(order.calldata.replace('0x', ''), 'hex'),
      Buffer.from(order.replacementPattern.replace('0x', ''), 'hex'),
      order.getStaticExtradata()     
    ];

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
    let total = buy.getBasePrice();
    if(buy.amount) {
      total = '0x' + new BigNumber(total).multipliedBy(new BigNumber(buy.amount)).toString(16);
    }
    const args = [
      [
        buy.getExchange(), buy.getMaker(), buy.getTaker(), 
        buy.getFeeRecipient(), buy.getTarget(),buy.getStaticTarget(), 
        sell.getExchange(), sell.getMaker(), sell.getTaker(), 
        sell.getFeeRecipient(), sell.getTarget(), sell.getStaticTarget()
      ],
      [
        buy.getMakerRelayerFee(), buy.getTakerRelayerFee(), buy.getMakerProtocolFee(), 
        buy.getTakerProtocolFee(), buy.getCoinType(), total, buy.getExtra(), 
        buy.getListingTime(), buy.getExpirationTime(), buy.getSalt(), 
        sell.getMakerRelayerFee(), sell.getTakerRelayerFee(), sell.getMakerProtocolFee(), 
        sell.getTakerProtocolFee(), sell.getCoinType(), total, sell.getExtra(), 
        sell.getListingTime(), sell.getExpirationTime(), sell.getSalt()
      ],
      [
        buy.getFeeMethod(), buy.getSide(), buy.getSaleKind(), buy.getHowToCall(), 
        sell.getFeeMethod(), sell.getSide(), sell.getSaleKind(), sell.getHowToCall()
      ],
      Buffer.from(buy.getCalldata().replace('0x', ''), 'hex'),
      Buffer.from(sell.getCalldata().replace('0x', ''), 'hex'),
      Buffer.from(buy.getReplacementPattern().replace('0x', ''), 'hex'),
      Buffer.from(sell.getReplacementPattern().replace('0x', ''), 'hex'),
      buy.getStaticExtradata(),
      sell.getStaticExtradata(),
      [
        buy.v,
        sell.v
      ],
      [
        buy.r,
        buy.s,
        sell.r,
        sell.s,
        metadata??nullBytes32
      ]
    ];

    console.log('args for atomicMatch=', args);
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

    return {
      abi: abi,
      args: args
    };
  }

  getTransferFromAbi(from: string, to: string, tokenId: string) {
    const abi = 	{
      "inputs": [
        {
          "internalType": "address",
          "name": "_from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [from, to, tokenId];

    return this.web3Serv.getGeneralFunctionABI(abi, args);
  }

  getSafeTransferFromAbi(from: string, to: string, tokenId: string, amount: number) {
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [from, to, tokenId, '0x' + new BigNumber(amount).shiftedBy(18).toString(16), '0x0'];

    const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
    return abiData;
  }

  getUserAuthenticatedAbi(address: string) {
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getUserAuthenticatedProxies",
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
    const args = [address];
    const funAbi = this.web3Serv.getGeneralFunctionABI(abi, args);
    return funAbi; 
  }

  getRegisterProxyAbiArgs() {
    const abi = {
      "constant": false,
      "inputs": [],
      "name": "registerProxy",
      "outputs": [
        {
          "name": "proxy",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
    const args = [];
    return { abi, args };    
  }

  createOrder(
    maker: string, 
    taker: string,
    smartContractAddress: string, 
    tokenId: string, 
    coinType: number,
    price: number,
    makerRelayerFee: number,
    side: number,  //side = 1, sell;  side == 0 buy
    payoutPercentageFee: number,
    payoutWalletAddress: string) { 
    const makerProtocolFee = 0;
    let feeMethod = 0;
    if(payoutPercentageFee) {
      makerRelayerFee += (new BigNumber(payoutPercentageFee).multipliedBy(new BigNumber(100))).toNumber();
      feeMethod = 1;
    }
    const exchange = environment.addresses.smartContract.NFT_Exchange;

    let feeRecipient = '0x0000000000000000000000000000000000000FEE';
    if(payoutWalletAddress) {
      feeRecipient = this.utilServ.fabToExgAddress(payoutWalletAddress);
    }
    if(side == 0) {
      feeRecipient = '0x0000000000000000000000000000000000000000';
    }
    
    // const side = 1;
    const saleKind = 0;
    const howToCall = 0;
    /*
    const callData = '0x23b872dd' // - function signature for transfer, based on what function you use
    + '000000000000000000000000d46d7e8d5a9f482aeeb0918bef6a10445159f297'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + tokenId;
    */
   let callData = this.getTransferFromAbi(maker, nullAddress, tokenId);
   console.log('callData==', callData);
    let replacementPattern = '0x00000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    + '0000000000000000000000000000000000000000000000000000000000000000';

    if(side == 0) {
      callData = this.getTransferFromAbi(nullAddress, maker, tokenId);
      replacementPattern = '0x00000000'
        + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000';
    }

    const listingTime = Math.round(Date.now() / 1000);
    const salt = this.utilServ.getRandomInteger();
    const order = new NftOrder(exchange, maker, taker, makerRelayerFee, 
    0, makerProtocolFee, 0, feeRecipient, feeMethod, side, saleKind, smartContractAddress, howToCall,
    callData, replacementPattern, null, null, coinType, price, 0, listingTime, 
    0, salt);

    order.tokenId = tokenId;
    return order;

  }


  createOrderERC1155(
    maker: string, 
    taker: string,
    smartContractAddress: string, 
    tokenId: string, 
    coinType: number,
    price: number,
    quantity: number,
    makerRelayerFee: number,
    side: number,  //side = 1, sell;  side == 0 buy
    payoutPercentageFee: number,
    payoutWalletAddress: string) { 
    const makerProtocolFee = 0;
    let feeMethod = 0;
    if(payoutPercentageFee) {
      makerRelayerFee += (new BigNumber(payoutPercentageFee).multipliedBy(new BigNumber(100))).toNumber();
      feeMethod = 1;
    }
    const exchange = environment.addresses.smartContract.NFT_Exchange;


    let feeRecipient = '0x0000000000000000000000000000000000000FEE';
    if(payoutWalletAddress) {
      feeRecipient = this.utilServ.fabToExgAddress(payoutWalletAddress);
    }
    if(side == 0) {
      feeRecipient = '0x0000000000000000000000000000000000000000';
    }
    
    // const side = 1;
    const saleKind = 0;
    const howToCall = 0;
    /*
    const callData = '0x23b872dd' // - function signature for transfer, based on what function you use
    + '000000000000000000000000d46d7e8d5a9f482aeeb0918bef6a10445159f297'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + tokenId;
    */
   let callData = this.getSafeTransferFromAbi(maker, nullAddress, tokenId, quantity);
   console.log('callData==', callData);
    let replacementPattern = '0x00000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + '0000000000000000000000000000000000000000000000000000000000000000'
    + '0000000000000000000000000000000000000000000000000000000000000000';

    if(side == 0) {
      callData = this.getSafeTransferFromAbi(nullAddress, maker, tokenId, quantity);
      replacementPattern = '0x00000000'
        + 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000'
        + '0000000000000000000000000000000000000000000000000000000000000000';
    }

    const listingTime = Math.round(Date.now() / 1000);
    const salt = this.utilServ.getRandomInteger();
    const order = new NftOrder(exchange, maker, taker, makerRelayerFee, 
    0, makerProtocolFee, 0, feeRecipient, feeMethod, side, saleKind, smartContractAddress, howToCall,
    callData, replacementPattern, null, null, coinType, price, 0, listingTime, 
    0, salt);

    order.tokenId = tokenId;
    order.amount = quantity;
    return order;

  }

}