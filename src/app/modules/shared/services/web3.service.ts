import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import { environment } from '../../../../environments/environment';
import * as ethUtil from 'ethereumjs-util';
import { UtilService } from './util.service';
import BigNumber from 'bignumber.js';
import Common from 'ethereumjs-common';
import KanbanTxService from './kanban.tx.service';
import { Signature, EthTransactionObj } from '../../../interfaces/kanban.interface';


@Injectable({ providedIn: 'root' })
export class Web3Service {
  constructor(private utilServ: UtilService) {
  }
    
  getWeb3Provider() {
    if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider);
    } else {
      const web3 = new Web3(Web3.givenProvider);
      return web3;
    }
  }

  async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number,
    value = 0, options = { gasPrice: 0, gasLimit: 0 }) {
    // console.log('abiHex before', abiHex);
    console.log('keyPair===', keyPair);
    if (abiHex.startsWith('0x')) {
      abiHex = abiHex.slice(2);
    }

    let gasPrice = environment.chains.KANBAN.gasPrice;
    let gasLimit = environment.chains.KANBAN.gasLimit;
    if (options) {
      if (options.gasPrice) {
        gasPrice = options.gasPrice;
      }
      if (options.gasLimit) {
        gasLimit = options.gasLimit;
      }
    }
    // console.log('abiHex after', abiHex);

    console.log('gasPrice=', gasPrice);
    console.log('gasLimit=', gasLimit);
    const txObject = {
      to: address,
      nonce: nonce,
      data: '0x' + abiHex,
      value: value,
      gas: gasLimit,

      // coin: '0x',
      gasPrice: gasPrice  // in wei
      // gasPrice: 40  // in wei
    };

    const privKey = keyPair.privateKeyBuffer.privateKey;

    let txhex = '';

    const customCommon = Common.forCustomChain(
      environment.chains.ETH.chain,
      {
        name: environment.chains.KANBAN.chain.name,
        networkId: environment.chains.KANBAN.chain.networkId,
        chainId: environment.chains.KANBAN.chain.chainId
      },
      environment.chains.ETH.hardfork,
    );
    const tx = new KanbanTxService(txObject, { common: customCommon });

    tx.sign(privKey);
    const serializedTx = tx.serialize();
    txhex = '0x' + serializedTx.toString('hex');
    return txhex;

    /*
    const web3 = this.getWeb3Provider();

    const signMess = await web3.eth.accounts.signTransaction(txObject, privateKey) as EthTransactionObj;
    console.log('signMess in signMessageWithPrivateKey=');
    console.log(signMess);
    return signMess.rawTransaction;   
    */
  }

  getWithdrawFuncABI(coinType: number, amount: BigNumber, destAddress: string) {

    // let abiHex = '3a5b6c70';

    /*
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'withdraw',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    let abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);

    */

    let abiHex = '3295d51e';
    // console.log('abiHex there we go:' + abiHex);  
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 64);
    // console.log('abiHex1=' + abiHex);

    const amountHex = amount.toString(16);
    // console.log('amount=' + amount);
    // console.log('amountHex=' + amountHex);
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    // console.log('abiHex2=' + abiHex);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(destAddress), 64);
    // console.log('abiHex final:' + abiHex);    
    return abiHex;
  }

  getDepositFuncABI(coinType: number, txHash: string, amount: BigNumber, addressInKanban: string, signedMessage: Signature) {

    // console.log('params for getDepositFuncABI:');
    // console.log('coinType=' + coinType + ',txHash=' + txHash + ',amount=' + amount + ',addressInKanban=' + addressInKanban);
    console.log('signedMessage=', signedMessage);
    const web3 = this.getWeb3Provider();
    const func: any = {
      'constant': false,
      'inputs': [
        {
          'name': '_coinType',
          'type': 'uint32'
        },
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '_value',
          'type': 'uint256'
        },
        {
          'name': '_addressInKanban',
          'type': 'address'
        },
        {
          'name': '',
          'type': 'bytes32'
        },
        {
          'name': '',
          'type': 'bytes32'
        }
      ],
      'name': 'deposit',
      'outputs': [
        {
          'name': 'success',
          'type': 'bool'
        }
      ],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    };
    //let abiHex = this.utilServ.stripHexPrefix(web3.eth.abi.encodeFunctionSignature(func));
    // console.log('abiHex for addDeposit=', abiHex);
    let abiHex = '379eb862';
    abiHex += this.utilServ.stripHexPrefix(signedMessage.v);
    abiHex += this.utilServ.fixedLengh(coinType.toString(16), 62);
    abiHex += this.utilServ.stripHexPrefix(txHash);
    const amountHex = amount.toString(16);
    console.log('amountHex=', this.utilServ.fixedLengh(amountHex, 64));
    abiHex += this.utilServ.fixedLengh(amountHex, 64);
    abiHex += this.utilServ.fixedLengh(this.utilServ.stripHexPrefix(addressInKanban), 64);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.r);
    abiHex += this.utilServ.stripHexPrefix(signedMessage.s);

    return abiHex;

  }

  signMessageWithPrivateKey(message: string, keyPair: any) {
    console.log('message==', message);
    console.log('keyPair==', keyPair);
    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    console.log('privateKey==', privateKey);
    //const privateKey = keyPair.privateKey;
    const web3 = this.getWeb3Provider();

    const signMess = web3.eth.accounts.sign(message, privateKey);
    return signMess;
  }
    
    async signTxWithPrivateKey(txParams: any, keyPair: any) {
        /*
        const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
    
        console.log('in signTxWithPrivateKey');
        const web3 = this.getWeb3Provider();
        console.log('in111');
        console.log(txParams);
        console.log(privateKey);
        const signMess = await web3.eth.accounts.signTransaction(txParams, privateKey) as EthTransactionObj;
        console.log('in222');
        console.log(signMess);
        return signMess.rawTransaction;
        */
        const privKey = keyPair.privateKeyBuffer;
        console.log('privKey=====', privKey);
        console.log('txParams=====', txParams);
        const EthereumTx = Eth.Transaction;
        const tx = new EthereumTx(txParams, { chain: environment.chains.ETH.chain, hardfork: environment.chains.ETH.hardfork });
        tx.sign(privKey);
        const serializedTx = tx.serialize();
        const txhex = '0x' + serializedTx.toString('hex');
        return txhex;
      }

      getFuncABI(func) {
        const web3 = this.getWeb3Provider();
        const abiHex = web3.eth.abi.encodeFunctionSignature(func).substring(2);
        return abiHex;
      }   

      getGeneralFunctionABI(func, paramsArray) {
        const web3 = this.getWeb3Provider();
        const abiHex = web3.eth.abi.encodeFunctionCall(func, paramsArray);
        return abiHex;
      }  
          
      getHash(input: string) {
        const web3 = this.getWeb3Provider();
        return web3.utils.sha3(input);
      }
      
      getTransferFunctionABI(to, coin, value, comment) {
        const web3 = this.getWeb3Provider();
        const func = {
          'constant': false,
          'inputs': [
            {
              'name': '_to',
              'type': 'address'
            },
            {
              'name': '_coinType',
              'type': 'uint32'
            },
            {
              'name': '_value',
              'type': 'uint256'
            },
            {
              "name": "_comment",
              "type": "bytes32"
            }
          ],
          'name': 'transfer',
          'outputs': [
            {
              'name': 'success',
              'type': 'bool'
            }
          ],
          'payable': false,
          'stateMutability': 'nonpayable',
          'type': 'function'
        };
    
        const params = [to, coin, value, web3.utils.asciiToHex(comment)];
        const abiHex = this.getGeneralFunctionABI(func, params);
        return abiHex;
      }

      getTransactionHash(txhex: string) {
        const hash = ethUtil.keccak(txhex).toString('hex');
        return '0x' + hash;
      }    
}