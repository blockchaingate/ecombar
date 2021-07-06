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
import * as Account from 'eth-lib/lib/account';
import * as  Hash from 'eth-lib/lib/hash';
import * as Btc from 'bitcoinjs-lib';

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

  signMessageTest(msg: string, privateKey) {
    const sig = this.signKanbanMessageWithPrivateKey(msg, privateKey);

    console.log('msg=', msg);
    console.log('sig there=', sig);
    const prefix = Buffer.from("\x17Kanban Signed Message:\n");
    let prefixedMsg = Hash.keccak256s(
      Buffer.concat([prefix, Buffer.from(String(msg.length)), Buffer.from(msg)])
    );
    
    const buf = Buffer.from(prefixedMsg.replace('0x', ''), 'hex');
    console.log('buf=', buf);

    console.log('before recover:');
    console.log('buf=', buf);
    console.log('v=', sig.v);
    console.log('r=', sig.r);
    console.log('s=', sig.s);

    const pubKey  = ethUtil.ecrecover(buf, sig.v, sig.r, sig.s);

    /*
    var sender = ethUtil.publicToAddress(pubKey)
    var addr = ethUtil.bufferToHex(sender)
    console.log('sender=', sender);
    console.log('addr=', addr);
    */

    /*
    const { address } = Btc.payments.p2pkh({
      pubkey: pubKey
    });

    console.log('address=', address);
    */
    //const pubkey = Buffer.from( '0250863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352', 'hex' );
    //const pubkeyBuf = Buffer.from('04a097026e876544a0e40f9ca836435560af4470e161bf60c23465dcb3151c947d1cbe052875211972107e25fca8dd939f1c6e749a43862673ec5cf7a8567f2d95', 'hex')
    const pubkeyBuf = Buffer.concat([Buffer.from('04', 'hex'), pubKey]);
    const pubkey = Btc.ECPair.fromPublicKey(pubkeyBuf);

    const { address } = Btc.payments.p2pkh({ 
      pubkey: pubkey.publicKey,
      network: environment.chains['FAB']['network']
     });


    return address;
    //console.log('pubKey=', pubKey);
  }

  getProvider() {
    if (typeof window.web3 !== 'undefined') {
      return window.web3.currentProvider;
    } else {
      return Web3.givenProvider;
    }    
  }

  formCreateSmartContractABI(abiArray, bytecode, args) {

    const web3 = this.getWeb3Provider();
    var MyContract = new web3.eth.Contract(abiArray);

    const abi = MyContract.deploy({
        data: bytecode,
        arguments: args
    })
    .encodeABI();   

    return abi;
  }
  
  getCreateIDABI(typeId: number, hashData: string) {
    const func: any = {
      "constant": false,
      "inputs": [
        {
          "name": "_type",
          "type": "bytes2"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "createID",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = ['0x' + typeId.toString(16), hashData];

    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }
 
  getUpdateIDABI(objectID: string, hashData: string) {
    const sequenceID = this.utilServ.ObjectId2SequenceId(objectID);
    const func: any =  {
      "constant": false,
      "inputs": [
        {
          "name": "_objectID",
          "type": "bytes30"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "updateID",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = ['0x' + sequenceID, hashData];

    console.log('params=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }  

  getChangeOwnerABI(objectID: string, newOwner: string) {
    newOwner = this.utilServ.fabToExgAddress(newOwner);
    const sequenceID = this.utilServ.ObjectId2SequenceId(objectID);
    const func: any = {
      "constant": false,
      "inputs": [
        {
          "name": "_objectID",
          "type": "bytes30"
        },
        {
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "changeOwner",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  

    const params = ['0x' + sequenceID, newOwner];
    console.log('params for getChangeOwnerABI=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }  

  getAddRecordABI(sequence: string, hashData: string) {
    const web3 = this.getWeb3Provider();
    const func: any =   {
      "constant": false,
      "inputs": [
        {
          "name": "_sequence",
          "type": "bytes32"
        },
        {
          "name": "_hashData",
          "type": "bytes32"
        }
      ],
      "name": "addRecord",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };  
    const params = [web3.utils.asciiToHex(sequence), hashData];

    console.log('params=', params);
    const abiHex = this.getGeneralFunctionABI(func, params);
    return abiHex;
  }
  
  async signAbiHexWithPrivateKey(abiHex: string, keyPair: any, address: string, nonce: number,
    value = 0, options = { gasPrice: 0, gasLimit: 0 }) {
    // console.log('abiHex before', abiHex);
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

  hashKanbanMessage(data) {
    const web3 = this.getWeb3Provider();
    var messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    var messageBytes = web3.utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x17Kanban Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    var hash = Hash.keccak256s(ethMessage);    
    console.log('hash1=', hash);
    return hash;
  }

  signKanbanMessageWithPrivateKey(message: string, privateKey: any) {
    var hash = this.hashKanbanMessage(message);
    return this.signKanbanMessageHashWithPrivateKey(hash, privateKey);
  }

  signKanbanMessageHashWithPrivateKey(hash: string, privateKey: any) {

    const privateKeyHex = `0x${privateKey.toString('hex')}`;
    // 64 hex characters + hex-prefix
    if (privateKeyHex.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }    
    var signature = Account.sign(hash, privateKeyHex);
    var vrs = Account.decodeSignature(signature);
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
  }

  signMessageWithPrivateKey(message: string, keyPair: any) {

    const privateKey = `0x${keyPair.privateKey.toString('hex')}`;
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

      sha3(s: string) {
        const web3 = this.getWeb3Provider();
        return web3.utils.sha3(s);
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