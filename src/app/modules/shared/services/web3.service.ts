import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare let window: any;
import * as Eth from 'ethereumjs-tx';
import { environment } from '../../../../environments/environment';
import * as ethUtil from 'ethereumjs-util';

@Injectable({ providedIn: 'root' })
export class Web3Service {
  
  getWeb3Provider() {
    if (typeof window.web3 !== 'undefined') {
      return new Web3(window.web3.currentProvider);
    } else {
      const web3 = new Web3(Web3.givenProvider);
      return web3;
    }
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
             
      getTransactionHash(txhex: string) {
        const hash = ethUtil.keccak(txhex).toString('hex');
        return '0x' + hash;
      }    
}