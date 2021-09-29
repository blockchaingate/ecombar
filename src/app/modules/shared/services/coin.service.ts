import { Injectable } from '@angular/core';
import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { Web3Service } from './web3.service';
import BigNumber from 'bignumber.js/bignumber';
import { MyCoin } from '../../../models/mycoin';
import * as bchaddr from 'bchaddrjs';
import * as Btc from 'bitcoinjs-lib';
import * as BIP32 from 'node_modules/bip32';
import { environment } from '../../../../environments/environment';
import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as wif from 'wif';
import { Address } from 'src/app/models/address';
import { coin_list } from '../../../../environments/coins';
import { Signature } from '../../../interfaces/kanban.interface';
import * as bitcoinMessage from 'bitcoinjs-message';
import TronWeb from 'tronweb';
import { instantiateSecp256k1, hexToBin, binToHex } from '@bitauth/libauth';

const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider(environment.chains.TRX.fullNode);
const solidityNode = new HttpProvider(environment.chains.TRX.solidityNode);
const eventServer = new HttpProvider(environment.chains.TRX.eventServer);
const ADDRESS_PREFIX_REGEX = /^(41)/;

const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
);
@Injectable({ providedIn: 'root' })
export class CoinService {
    txids: any;
    constructor(
        private apiServ: ApiService, 
        private web3Serv: Web3Service, 
        private utilServ: UtilService
    ) {
        this.txids = [];
    }

    getAddress(addresses: any, name: string) {
        return addresses.filter(item => item.name == name)[0].address;
    }
    
    getOriginalMessage(coinType: number, txHash: string, amount: BigNumber, address: string) {

        let buf = '';
        const coinTypeHex = coinType.toString(16);
        buf += this.utilServ.fixedLengh(coinTypeHex, 8);
        buf += this.utilServ.fixedLengh(txHash, 64);
        const hexString = amount.toString(16);
        buf += this.utilServ.fixedLengh(hexString, 64);
        buf += this.utilServ.fixedLengh(address, 64);

        return buf;
    }

    async toUncompressedPublicKey(compressedKey: string) {
        //var compressedKey = "03d061e9c5891f579fd548cfd22ff29f5c642714cc7e7a9215f0071ef5a5723f69";
        console.log('compressedKey====', compressedKey);
        compressedKey = compressedKey.replace(/^0x/, "");
        const secp256k1 = await instantiateSecp256k1();
        console.log('1');
        const compressed = hexToBin(compressedKey);
        console.log('2');
        const uncompressed = secp256k1.uncompressPublicKey(compressed);
        console.log('3');
        console.log(binToHex(uncompressed));
        
        return binToHex(uncompressed).replace(/^04/, "");;
    }

    signedMessage(originalMessage: string, keyPair: any) {
        // originalMessage = '000254cbd93f69af7373dcf5fc01372230d309684f95053c7c9cbe95cf4e4e2da731000000000000000000000000000000000000000000000000000009184e72a000000000000000000000000000a2a3720c00c2872397e6d98f41305066cbf0f8b3';
        // console.log('originalMessage=', originalMessage);
        
        let signature: Signature;
        const name = keyPair.name;
        const tokenType = keyPair.tokenType;

        if (name === 'ETH' || tokenType === 'ETH') {
            signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
            // console.log('signature in signed is ');
            // console.log(signature);
        } else
            if (name === 'FAB' || name === 'BTC' || tokenType === 'FAB' || name === 'BCH' || name === 'DOGE' || name === 'LTC') {
                // signature = this.web3Serv.signMessageWithPrivateKey(originalMessage, keyPair) as Signature;
                let signBuffer: Buffer;
                console.log('keyPair.privateKeyBuffer.compressed===', keyPair.privateKeyBuffer.compressed);
                // if(name === 'FAB' || name === 'BTC' || tokenType === 'FAB' || name === 'LTC' || name === 'DOGE') {
                const chainName = (tokenType === 'FAB') ? 'FAB' : name;

                const messagePrefix = environment.chains[chainName].network.messagePrefix;

                console.log('messagePrefix=', messagePrefix);

                signBuffer = bitcoinMessage.sign(originalMessage, keyPair.privateKeyBuffer.privateKey,
                    keyPair.privateKeyBuffer.compressed, messagePrefix);
                /*
                } else 
                if(name === 'BCH') {
    
                   
                   var message = new BchMessage(originalMessage);
    
                   //var signature = message.sign(privateKey);
                   
                   var hash = message.magicHash();
                   var ecdsa = new bitcore.crypto.ECDSA();
                   ecdsa.hashbuf = hash;
                   ecdsa.privkey = keyPair.privateKey;
                   ecdsa.pubkey = keyPair.privateKey.toPublicKey();
                   ecdsa.signRandomK();
                   ecdsa.calci();
                   signBuffer = ecdsa.sig.toCompact();
                   // console.log('signature=', signature);
    
                }
                */
                /*
                if (name === 'LTC') {
                    var message = new LiteMessage(originalMessage);
                    var base64 = message.sign(keyPair.privateKey);
    
                    signBuffer = Buffer.from(base64, 'base64');
    
                } else 
                if (name === 'DOGE') {
    
                   //var message = new DogeMessage(originalMessage);
    
    
                   //var MAGIC_BYTES = new Buffer('Actinium Signed Message:\n');
                   var MAGIC_BYTES = new Buffer('Dogecoin Signed Message:\n');
    
                   var prefix1 = dogecore.encoding.BufferWriter.varintBufNum(MAGIC_BYTES.length);
                   var messageBuffer = new Buffer(originalMessage);
                   var prefix2 = dogecore.encoding.BufferWriter.varintBufNum(messageBuffer.length);
                   var buf = Buffer.concat([prefix1, MAGIC_BYTES, prefix2, messageBuffer]);
                    console.log('buf there eeeee=', buf);
                   var hash = dogecore.crypto.Hash.sha256sha256(buf);
                   //  return hash;
                  
                   console.log('hash there we go=');
                   console.log(hash);
    
    
                   //var hash = message.magicHash();
                   var ecdsa = new dogecore.crypto.ECDSA();
                   ecdsa.hashbuf = hash;
                   ecdsa.privkey = keyPair.privateKey;
                   ecdsa.pubkey = keyPair.privateKey.toPublicKey();
                   ecdsa.signRandomK();
                   ecdsa.calci();
                   signBuffer = ecdsa.sig.toCompact();            
                }
                */
                // const signHex = `${signBuffer.toString('hex')}`;
                const v = `0x${signBuffer.slice(0, 1).toString('hex')}`;
                const r = `0x${signBuffer.slice(1, 33).toString('hex')}`;
                const s = `0x${signBuffer.slice(33, 65).toString('hex')}`;

                // console.log('v=' + v);
                // console.log('r=' + r);
                // console.log('s=' + s);
                signature = { r: r, s: s, v: v };

                console.log('signature====', signature);
            }
        return signature;
    }

    getOfficialAddress(coinName: string) {
        if (environment.addresses.exchangilyOfficial[coinName]) {
            return environment.addresses.exchangilyOfficial[coinName];
        }
        return '';
    }

    formMyCoin(addresses: any, name: string) {
        const mycoin = new MyCoin(name);
        mycoin.receiveAdds = [];
        if(['BTC','LTC','DOGE', 'BCH', 'ETH', 'FAB'].indexOf(name) >= 0) {
            if(name == 'ETH') {
                mycoin.decimals = 18;
            } else {
                mycoin.decimals = 8;
            }
            const address = this.getAddress(addresses, name);
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);
            return mycoin;
        }
        if(
            ['EXG', 'DUSD', 'DCAD', 'DCNY', 'DJPY', 'DGBP', 
            'DEURO', 'DAUD', 'DMYR', 'DKRW', 'DPHP', 
            'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR',
            'DMXN', 'DBRL', 'DNGN'
        ].indexOf(name) >= 0) {
            mycoin.tokenType = 'FAB';
            const address = this.getAddress(addresses, 'FAB');
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);            
        } else {
            mycoin.decimals = 18;
            const erc20Tokens8 = [
                'FUN', 'WAX', 'MTL'
            ];
            if(erc20Tokens8.indexOf(name) >= 0) {
                mycoin.decimals = 8;
            }   
            
            const erc20Tokens6 = [
                'USDT', 'POWR'
            ];
            if(erc20Tokens6.indexOf(name) >= 0) {
                mycoin.decimals = 6;
            }  
            
            const erc20Tokens4 = [
                'CEL'
            ];
            if(erc20Tokens4.indexOf(name) >= 0) {
                mycoin.decimals = 4;
            }              
            mycoin.tokenType = 'ETH';

            const address = this.getAddress(addresses, 'ETH');
            const addr = new Address(0, address, 0);
            mycoin.receiveAdds.push(addr);            
        }
        return mycoin;
    }

    async depositFab(scarContractAddress: string, seed: any, mycoin: MyCoin, amount: number) {
        // sendTokens in https://github.com/ankitfa/Fab_sc_test1/blob/master/app/walletManager.js
        const gasLimit = 800000;
        const gasPrice = 40;

        // console.log('scarContractAddress=', scarContractAddress);
        const totalAmount = gasLimit * gasPrice / 1e8;
        // let cFee = 3000 / 1e8 // fee for the transaction

        let totalFee = totalAmount;

        // -----------------------------------------------------------------------
        const addDepositFunc: any = {
            'constant': false,
            'inputs': [],
            'name': 'addDeposit',
            'outputs': [
                {
                    'name': '',
                    'type': 'address'
                }
            ],
            'payable': true,
            'stateMutability': 'payable',
            'type': 'function'
        };

        let fxnCallHex = this.web3Serv.getGeneralFunctionABI(addDepositFunc, []);
        fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);

        // console.log('fxnCallHexfxnCallHexfxnCallHexfxnCallHexfxnCallHex=', fxnCallHex);
        const contract = Btc.script.compile([
            84,
            this.utilServ.number2Buffer(gasLimit),
            this.utilServ.number2Buffer(gasPrice),
            this.utilServ.hex2Buffer(fxnCallHex),
            this.utilServ.hex2Buffer(scarContractAddress),
            194
        ]);

        // console.log('contract=', contract);
        const contractSize = contract.toJSON.toString().length;

        // console.log('contractSize=' + contractSize);
        totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

        console.log('totalFee=' + totalFee);
        const res = await this.getFabTransactionHex(seed, mycoin, contract, amount, totalFee,
            environment.chains.FAB.satoshisPerBytes, environment.chains.FAB.bytesPerInput, false);

        const txHex = res.txHex;
        let errMsg = res.errMsg;
        let txHash = '';
        if (!errMsg) {
            const res2 = await this.apiServ.postFabTx(txHex);
            txHash = res2.txHash;
            errMsg = res2.errMsg;
        }
        return { txHash: txHash, errMsg: errMsg };
    }

    getCoinTypeIdByName(name: string) {
        name = name.toUpperCase();
        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.name === name) {
                return coin.id;
            }
        }
        return -1;
    }
    
    getCoinNameByTypeId(id: number) {

        for (let i = 0; i < coin_list.length; i++) {
            const coin = coin_list[i];
            if (coin.id === id) {
                return coin.name;
            }
        }
        return '';
    }

    async getFabTransactionHex(seed: any, mycoin: MyCoin, to: any, amount: number, extraTransactionFee: number,
        satoshisPerBytes: number, bytesPerInput: number, getTransFeeOnly: boolean) {
            extraTransactionFee = Number(extraTransactionFee);
            amount = Number(amount);
        let index = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;
        let transFee = 0;
        let amountInTx = new BigNumber(0);
        const txids = [];
        const feePerInput = bytesPerInput * satoshisPerBytes;
        const receiveAddsIndexArr = [];
        const changeAddsIndexArr = [];
        // console.log('amount111111111111=', amount);
        console.log('extraTransactionFee=', extraTransactionFee);
        const totalAmount = Number(amount) + Number(extraTransactionFee);
        // console.log('totalAmount=', totalAmount);
        let amountNum = new BigNumber(this.utilServ.toBigNumber(totalAmount, 8)).toNumber();
        // console.log('amountNum=', amountNum);
        amountNum += (2 * 34) * satoshisPerBytes;
        // console.log('amountNum=', amountNum);
        // const TestNet = Btc.networks.testnet;
        const network = environment.chains.BTC.network;

        const txb = new Btc.TransactionBuilder(network);
        // console.log('amountNum=', amountNum);
        let txHex = '';

        for (index = 0; index < mycoin.receiveAdds.length; index++) {

            address = mycoin.receiveAdds[index].address;
            // console.log('address in getFabTransactionHex=' + address);
            let fabUtxos = await this.apiServ.getFabUtxos(address);

            if (fabUtxos && fabUtxos.length) {
                fabUtxos = fabUtxos.sort((a,b) => b.value - a.value);
                // console.log('fabUtxos=', fabUtxos);
                // console.log('fabUtxos.length=', fabUtxos.length);
                for (let i = 0; i < fabUtxos.length; i++) {
                    const utxo = fabUtxos[i];
                    const idx = utxo.idx;
                    /*
                    const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                    if (isLocked) {
                        continue;
                    }
                    */

                    const txidItem = {
                        txid: utxo.txid,
                        idx: idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            console.log('continueeee');
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(utxo.txid, idx);
                    // console.log('input is');
                    // console.log(utxo.txid, utxo.idx, utxo.value);
                    receiveAddsIndexArr.push(index);
                    totalInput += utxo.value;
                    // console.log('totalInput here=', totalInput);
                    amountNum -= utxo.value;
                    amountNum += feePerInput;
                    if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                        console.log('finished');
                        finished = true;
                        break;
                    }
                }
            }
            if (finished) {
                break;
            }
        }

        // console.log('totalInput here 1=', totalInput);

        if (!finished) {
            for (index = 0; index < mycoin.changeAdds.length; index++) {

                address = mycoin.changeAdds[index].address;

                const fabUtxos = await this.apiServ.getFabUtxos(address);

                if (fabUtxos && fabUtxos.length) {
                    for (let i = 0; i < fabUtxos.length; i++) {
                        const utxo = fabUtxos[i];
                        const idx = utxo.idx;

                        /*
                        const isLocked = await this.apiService.isFabTransactionLocked(utxo.txid, idx);
                        if (isLocked) {
                            continue;
                        }      
                        */

                        const txidItem = {
                            txid: utxo.txid,
                            idx: idx
                        };

                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                console.log('continueeee');
                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);

                        txb.addInput(utxo.txid, idx);
                        // console.log('input is');
                        // console.log(utxo.txid, utxo.idx, utxo.value);
                        receiveAddsIndexArr.push(index);
                        totalInput += utxo.value;
                        // console.log('totalInput here=', totalInput);
                        amountNum -= utxo.value;
                        amountNum += feePerInput;
                        if (((amount > 0) || (mycoin.tokenType === 'FAB')) && (amountNum <= 0)) {
                            finished = true;
                            break;
                        }
                    }
                }
                if (finished) {
                    break;
                }
            }
        }
        // console.log('totalInput here 2=', totalInput);
        if ((amount > 0) && !finished) {
            // console.log('not enough fab coin to make the transaction.');
            return { txHex: '', errMsg: 'not enough fab coin to make the transaction.', transFee: 0, txids: txids };
        }


        const changeAddress = mycoin.receiveAdds[0];

        let outputNum = 2;
        if ((mycoin.tokenType === '') && (amount === 0)) {
            outputNum = 1;
        }
        transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34) * satoshisPerBytes;

        const output1 = Math.round(totalInput
            - new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber()
            - transFee);

        console.log('amount=', amount);
        console.log('extraTransactionFee=', extraTransactionFee);
        console.log('amount + extraTransactionFee=', amount + extraTransactionFee);
        console.log('new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber()=', new BigNumber(this.utilServ.toBigNumber(amount + extraTransactionFee, 8)).toNumber());
        /*
        if((output1 < 2730)  && !(mycoin.tokenType == 'FAB')) {
            transFee += output1;
        } 
        */

        if (getTransFeeOnly) {
            return { txHex: '', errMsg: '', transFee: transFee + new BigNumber(this.utilServ.toBigNumber(extraTransactionFee, 8)).toNumber(), amountInTx: amountInTx };
        }
        // const output2 = Math.round(amount * 1e8);    
        const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
        amountInTx = output2;


        if (output1 < 0) {
            // console.log('output1 or output2 should be greater than 0.');
            console.log('totalInput=', totalInput);
            console.log('amount=', amount);
            console.log('transFee=', transFee);
            console.log('output1=', output1);
            return {
                txHex: '',
                errMsg: 'Not enough FAB or utxos for this transaction',
                transFee: 0, amountInTx: amountInTx, txids: txids
            };
        }
        // console.log('amount=' + amount + ',totalInput=' + totalInput);
        // console.log('defaultTransactionFee=' + extraTransactionFee);
        // console.log('(receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput)=' 
        // + (receiveAddsIndexArr.length + changeAddsIndexArr.length) * feePerInput);
        // console.log('output1=' + output1 + ',output2=' + output2);

        if ((amount > 0) || (mycoin.tokenType == 'FAB')) {
            /*
            if((output1 >= 2730) || (mycoin.tokenType == 'FAB')) {
                console.log('added output1');
                txb.addOutput(changeAddress.address, output1);
            }
            */
            txb.addOutput(changeAddress.address, output1);
            txb.addOutput(to, output2.toNumber());
        } else {
            txb.addOutput(to, output1);
        }


        for (index = 0; index < receiveAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, receiveAddsIndexArr[index], 'b');
            // console.log('keyPair.privateKey=' + keyPair.privateKey + ',keyPair.publicKey=' + keyPair.publicKey);
            // console.log('receiveAddsIndexArr[index]=' + receiveAddsIndexArr[index] + ',address for keypair=' + keyPair.address);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(index, alice);
        }

        for (index = 0; index < changeAddsIndexArr.length; index++) {
            const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 1, changeAddsIndexArr[index], 'b');
            // console.log('changeAddsIndexArr[index]=' + changeAddsIndexArr[index] + 'address for keypair=' + keyPair.address);
            const alice = Btc.ECPair.fromWIF(keyPair.privateKey, network);
            txb.sign(receiveAddsIndexArr.length + index, alice);
        }

        txHex = txb.build().toHex();
        return { txHex: txHex, errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
    }

    getTransactionHistoryEvents(addresses) {

        let btcAddress = '';
        let ethAddress = '';
        let fabAddress = '';
        let bchAddress = '';
        let dogeAddress = '';
        let ltcAddress = '';
        let trxAddress = '';

        for(let i=0;i<addresses.length;i++) {
            const addr = addresses[i];
            if(addr.name == 'BTC') {
                btcAddress = addr.address;
            } else 
            if(addr.name == 'ETH') {
                ethAddress = addr.address;
            } else 
            if(addr.name == 'FAB') {
                fabAddress = addr.address;
            } else  
            if(addr.name == 'BCH') {
                bchAddress = addr.address;
            } else  
            if(addr.name == 'DOGE') {
                dogeAddress = addr.address;
            } else   
            if(addr.name == 'LTC') {
                ltcAddress = addr.address;
            }  else   
            if(addr.name == 'TRX') {
                trxAddress = addr.address;
            }                                            
        }
        const data = {
            btcAddress: btcAddress,
            ethAddress: ethAddress,
            fabAddress: fabAddress,
            bchAddress: bchAddress,
            dogeAddress: dogeAddress,
            ltcAddress: ltcAddress,
            trxAddress: trxAddress
        }

        return this.apiServ.getTransactionHistoryEvents(data);
    }

    fabPublicKey2Address(publicKey) {
        const { address } = Btc.payments.p2pkh({
            pubkey: publicKey,
            network: environment.chains['FAB']['network']
        });

        return address;
    }

    getKeyPairs(name: string, seed: Buffer, chain: number, index: number, type: string) {

        let addr = '';
        const addrHash = '';
        let priKey;
        let pubKey = '';
        let priKeyHex = '';
        let priKeyDisp = '';
        let buffer = Buffer.alloc(32);

        if (!seed) {
            return null;
        }
        const path = 'm/44\'/' + environment.CoinType[name] + '\'/0\'/' + chain + '/' + index;

        if (name === 'BTC' || name === 'FAB' || name === 'LTC' || name === 'DOGE' || name === 'BCH') {
            const root = BIP32.fromSeed(seed, environment.chains[name]['network']);

            const childNode = root.derivePath(path);

            const { address } = Btc.payments.p2pkh({
                pubkey: childNode.publicKey,
                network: environment.chains[name]['network']
            });

            if (name === 'BCH') {
                addr = bchaddr.toCashAddress(address);
            } else {

                addr = address;
            }


            priKey = childNode.toWIF();
            pubKey = `0x${childNode.publicKey.toString('hex')}`;

            buffer = wif.decode(priKey);
            priKeyDisp = priKey;
        } else if (name === 'ETH') {

                const root = hdkey.fromMasterSeed(seed);
                const childNode = root.derivePath(path);

                const wallet = childNode.getWallet();
                const address = `0x${wallet.getAddress().toString('hex')}`;
                addr = address;
                buffer = wallet.getPrivateKey();
                priKey = wallet.getPrivateKey();
                priKeyDisp = buffer.toString('hex');

        } else if(name == 'TRX') {
            const root = BIP32.fromSeed(seed);
            const childNode = root.derivePath(path);
            priKey = childNode.privateKey;

            buffer = wif.decode(childNode.toWIF());
            addr = TronWeb.utils.crypto.getBase58CheckAddress(TronWeb.utils.crypto.getAddressFromPriKey(priKey));
        }
        /*
        const keyPairs = {
            address: addr,
            addressHash: addrHash,
            privateKey: priKey,
            privateKeyHex: priKeyHex,
            privateKeyBuffer: buffer,
            privateKeyDisplay: priKeyDisp,
            publicKey: pubKey,
            name: name
        };

        return keyPairs;
        */
       if(type == 'a') {
        return addr;
       } else 
       if(type == 'p') {
           return priKey;
       }

       const keyPairs = {
        address: addr,
        addressHash: addrHash,
        privateKey: priKey,
        privateKeyHex: priKeyHex,
        privateKeyBuffer: buffer,
        privateKeyDisplay: priKeyDisp,
        publicKey: pubKey,
        name: name
        };

        return keyPairs;
    }

    async sendTransaction(mycoin: MyCoin, seed: Buffer, toAddress: string, amount: number,
        options: any, doSubmit: boolean) {

        let index = 0;
        let finished = false;
        let address = '';
        let totalInput = 0;

        let gasPrice = 0;
        let gasLimit = 0;
        let satoshisPerBytes = 0;
        let bytesPerInput = 0;
        let feeLimit = 0;
        let txHex = '';
        let txHash = '';
        let errMsg = '';
        let transFee = 0;
        let tranFeeUnit = '';
        let txids = [];
        let amountInTx = new BigNumber(0);
        // console.log('options=', options);
        let getTransFeeOnly = false;
        if (options) {
            console.log('optionsoptionsoptions=', options);
            if (options.gasPrice) {
                gasPrice = options.gasPrice;
            }
            if (options.gasLimit) {
                gasLimit = options.gasLimit;
            }
            if (options.satoshisPerBytes) {
                satoshisPerBytes = options.satoshisPerBytes;
            }
            if (options.bytesPerInput) {
                bytesPerInput = options.bytesPerInput;
            }
            if (options.getTransFeeOnly) {
                getTransFeeOnly = options.getTransFeeOnly;
            }
            if(options.feeLimit) {
                feeLimit = options.feeLimit;
            }
        }
        console.log('satoshisPerBytes=', satoshisPerBytes);
        const receiveAddsIndexArr = [];
        const changeAddsIndexArr = [];

        // console.log('mycoin=');
        // console.log(mycoin);

        // let amountNum = amount * Math.pow(10, this.utilServ.getDecimal(mycoin));
        let amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, this.utilServ.getDecimal(mycoin))));
        // it's for all coins.
        amountNum = amountNum.plus((2 * 34) * satoshisPerBytes);
        console.log('amountNum=', amountNum.toString());
        // 2 output
        // console.log('toAddress=' + toAddress + ',amount=' + amount + ',amountNum=' + amountNum);

        if (mycoin.name === 'BTC' || mycoin.name === 'LTC' || mycoin.name === 'DOGE' || mycoin.name === 'BCH') { // btc address format
            if (mycoin.name === 'BCH') {
                toAddress = bchaddr.toLegacyAddress(toAddress);
            }
            if (!satoshisPerBytes) {
                satoshisPerBytes = environment.chains[mycoin.name].satoshisPerBytes;
            }
            if (!bytesPerInput) {
                bytesPerInput = environment.chains[mycoin.name].bytesPerInput;
            }
            const BtcNetwork = environment.chains[mycoin.name].network;
            const txb = new Btc.TransactionBuilder(BtcNetwork);

            for (index = 0; index < mycoin.receiveAdds.length; index++) {
                /*
                balance = mycoin.receiveAdds[index].balance;
                if (balance <= 0) {
                    continue;
                }
                */
                address = mycoin.receiveAdds[index].address;
                const balanceFull = await this.apiServ.getUtxos(mycoin.name, address);
                for (let i = 0; i < balanceFull.length; i++) {
                    const tx = balanceFull[i];
                    // console.log('i=' + i);
                    // console.log(tx);
                    if (tx.idx < 0) {
                        continue;
                    }


                    const txidItem = {
                        txid: tx.txid,
                        idx: tx.idx
                    };

                    let existed = false;
                    for (let iii = 0; iii < this.txids.length; iii++) {
                        const ttt = this.txids[iii];
                        if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                            existed = true;
                            break;
                        }
                    }

                    if (existed) {
                        continue;
                    }

                    txids.push(txidItem);

                    txb.addInput(tx.txid, tx.idx);
                    amountNum = amountNum.minus(tx.value);
                    amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                    totalInput += tx.value;
                    receiveAddsIndexArr.push(index);
                    if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                        finished = true;
                        break;
                    }
                }
                if (finished) {
                    break;
                }
            }
            if (!finished) {
                for (index = 0; index < mycoin.changeAdds.length; index++) {
                    /*
                    balance = mycoin.changeAdds[index].balance;
                    if (balance <= 0) {
                        continue;
                    }
                    */
                    address = mycoin.changeAdds[index].address;
                    const balanceFull = await this.apiServ.getBtcUtxos(address);
                    for (let i = 0; i < balanceFull.length; i++) {
                        const tx = balanceFull[i];
                        // console.log('i=' + i);
                        // console.log(tx);
                        if (tx.idx < 0) {
                            continue;
                        }

                        const txidItem = {
                            txid: tx.txid,
                            idx: tx.idx
                        };
                        let existed = false;
                        for (let iii = 0; iii < this.txids.length; iii++) {
                            const ttt = this.txids[iii];
                            if ((ttt.txid === txidItem.txid) && (ttt.idx === txidItem.idx)) {
                                console.log('continueeee');
                                existed = true;
                                break;
                            }
                        }

                        if (existed) {
                            continue;
                        }
                        txids.push(txidItem);
                        txb.addInput(tx.txid, tx.idx);
                        amountNum = amountNum.minus(tx.value);
                        amountNum = amountNum.plus(bytesPerInput * satoshisPerBytes);
                        totalInput += tx.value;
                        changeAddsIndexArr.push(index);

                        if ((amount > 0) && (amountNum.isLessThanOrEqualTo(0))) {
                            finished = true;
                            break;
                        }
                    }
                    if (finished) {
                        break;
                    }
                }
            }

            if ((amount > 0) && !finished) {
                txHex = '';
                txHash = '';
                errMsg = 'not enough fund.';
                return { txHex: txHex, txHash: txHash, errMsg: errMsg, amountInTx: amountInTx, txids: txids };
            }

            let outputNum = 2;
            if (amount === 0) {
                outputNum = 1;
            }

            transFee = ((receiveAddsIndexArr.length + changeAddsIndexArr.length) * bytesPerInput + outputNum * 34 + 10) * satoshisPerBytes;

            const changeAddress = mycoin.receiveAdds[0];
            // console.log('totalInput=' + totalInput);
            // console.log('amount=' + amount);
            // console.log('transFee=' + transFee);
            const output1 = Math.round(new BigNumber(totalInput - new BigNumber(amount).multipliedBy(new BigNumber(1e8)).toNumber() - transFee).toNumber());

            if (output1 < 2730) {
                transFee += output1;
            }
            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

            if (getTransFeeOnly) {
                return { txHex: '', txHash: '', errMsg: '', transFee: transFee, amountInTx: amountInTx, txids: txids };
            }
            // const output2 = Math.round(new BigNumber(amount * 1e8).toNumber());

            console.log('amountttttt=', amount);
            const output2 = new BigNumber(this.utilServ.toBigNumber(amount, 8));
            console.log('this.utilServ.toBigNumber(amount, 8)=', this.utilServ.toBigNumber(amount, 8));

            console.log('output1=', output1);
            amountInTx = output2;
            if (amount > 0) {
                if (output1 >= 2730) {
                    txb.addOutput(changeAddress.address, output1);
                }
                txb.addOutput(toAddress, output2.toNumber());
            } else {
                console.log('go amount = 0');
                txb.addOutput(toAddress, output1);
            }


            for (index = 0; index < receiveAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, receiveAddsIndexArr[index], 'b');
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(index, alice);
            }

            for (index = 0; index < changeAddsIndexArr.length; index++) {
                const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 1, changeAddsIndexArr[index], 'b');
                const alice = Btc.ECPair.fromWIF(keyPair.privateKey, BtcNetwork);
                txb.sign(receiveAddsIndexArr.length + index, alice);
            }

            txHex = txb.build().toHex();
            // console.log('doSubmit=', doSubmit);
            if (doSubmit) {
                // console.log('1');
                const res = await this.apiServ.postTx(mycoin.name, txHex);
                txHash = res.txHash;
                errMsg = res.errMsg;
                // console.log(txHash);

            } else {
                // console.log('2');
                const tx = Btc.Transaction.fromHex(txHex);
                txHash = '0x' + tx.getId();
                // console.log(txHash);
            }
        } else
            if (mycoin.name === 'FAB') {
                if (!satoshisPerBytes) {
                    satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                }
                if (!bytesPerInput) {
                    bytesPerInput = environment.chains.FAB.bytesPerInput;
                }

                const res1 = await this.getFabTransactionHex(seed, mycoin, toAddress, amount, 0,
                    satoshisPerBytes, bytesPerInput, getTransFeeOnly);
                console.log('res1=', res1);
                txHex = res1.txHex;
                errMsg = res1.errMsg;
                transFee = res1.transFee;
                amountInTx = res1.amountInTx;
                txids = res1.txids;
                transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                if (getTransFeeOnly) {
                    return { 
                        txHex: '', txHash: '', errMsg: '', 
                        transFee: transFee, 
                        tranFeeUnit: mycoin.name,
                        amountInTx: amountInTx 
                    };
                }

                if (!errMsg && txHex) {
                    if (doSubmit) {
                        const res = await this.apiServ.postFabTx(txHex);
                        txHash = res.txHash;
                        errMsg = res.errMsg;
                    } else {
                        const tx = Btc.Transaction.fromHex(txHex);
                        txHash = '0x' + tx.getId();
                    }
                }

            } else
                if (mycoin.name === 'ETH') {
                    console.log('mycoin.name==ETH');
                    if (!gasPrice) {
                        gasPrice = environment.chains.ETH.gasPrice;
                    }
                    if (!gasLimit) {
                        gasLimit = environment.chains.ETH.gasLimit;
                    }
                    transFee = Number(new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toFixed(6));
                    if (getTransFeeOnly) {
                        return { txHex: '', txHash: '', errMsg: '', 
                        transFee: transFee, 
                        tranFeeUnit: mycoin.name,
                        amountInTx: amountInTx, txids: txids };
                    }
                    // amountNum = amount * 1e18;
                    amountNum = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, 18)));
                    const address1 = mycoin.receiveAdds[0];
                    const currentIndex = address1.index;

                    const keyPair = this.getKeyPairs(mycoin.tokenType?mycoin.tokenType:mycoin.name, seed, 0, currentIndex,'b');
                    const nonce = await this.apiServ.getEthNonce(address1.address);
                    const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                    amountInTx = amountNum;

                    console.log('amountNum.toString(16)==', amountNum.toString(16));
                    const txParams = {
                        nonce: nonce,
                        gasPrice: gasPriceFinal,
                        gasLimit: gasLimit,
                        to: toAddress,
                        value: '0x' + amountNum.toString(16)
                    };

                    // console.log('txParams=', txParams);
                    txHex = await this.web3Serv.signTxWithPrivateKey(txParams, keyPair);

                    // console.log('txhex for etheruem:', txHex);
                    if (doSubmit) {
                        const retEth = await this.apiServ.postEthTx(txHex);
                        txHash = retEth.txHash;
                        errMsg = retEth.errMsg;
                        if (txHash.indexOf('txerError') >= 0) {
                            errMsg = txHash;
                            txHash = '';
                        }
                    } else {
                        txHash = this.web3Serv.getTransactionHash(txHex);
                    }
                } else
                    if (mycoin.tokenType === 'ETH') { // etheruem tokens
                        const address1 = mycoin.receiveAdds[0];
                        if (!gasPrice) {
                            gasPrice = environment.chains.ETH.gasPrice;
                        }
                        if (!gasLimit) {
                            gasLimit = environment.chains.ETH.gasLimitToken;
                        }
                        transFee = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).dividedBy(new BigNumber(1e9)).toNumber();
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: transFee, 
                            tranFeeUnit: mycoin.tokenType,
                            amountInTx: amountInTx, txids: txids };
                        }
                        const currentIndex = address1.index;
                        // console.log('currentIndex=' + currentIndex);
                        const keyPair = this.getKeyPairs(mycoin.tokenType ? mycoin.tokenType : mycoin.name, seed, 0, currentIndex, 'b');
                        const nonce = await this.apiServ.getEthNonce(address1.address);

                        let decimals = mycoin.decimals;

                        if (!decimals) {
                            decimals = 18;
                        }
                        console.log('decimals112===', decimals);
                        // const amountSent = amount * Math.pow(10, decimals);
                        const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                        const toAccount = toAddress;
                        let contractAddress = environment.addresses.smartContract[mycoin.name];
                        if(contractAddress.ETH) {
                            contractAddress = contractAddress.ETH;
                        }
                        // console.log('nonce = ' + nonce);
                        const func = {
                            'constant': false,
                            'inputs': [
                                {
                                    'name': 'recipient',
                                    'type': 'address'
                                },
                                {
                                    'name': 'amount',
                                    'type': 'uint256'
                                }
                            ],
                            'name': 'transfer',
                            'outputs': [
                                {
                                    'name': '',
                                    'type': 'bool'
                                }
                            ],
                            'payable': false,
                            'stateMutability': 'nonpayable',
                            'type': 'function'
                        };

                        const abiHex = this.web3Serv.getFuncABI(func);
                        // a9059cbb
                        // console.log('abiHexxx=' + abiHex);
                        const gasPriceFinal = new BigNumber(gasPrice).multipliedBy(new BigNumber(1e9)).toNumber();

                        amountInTx = amountSent;
                        const txData = {
                            nonce: nonce,
                            gasPrice: gasPriceFinal,
                            gasLimit: gasLimit,
                            // to: contractAddress,
                            from: keyPair.address,
                            value: Number(0),
                            to: contractAddress,
                            data: '0x' + abiHex + this.utilServ.fixedLengh(toAccount.slice(2), 64) +
                                this.utilServ.fixedLengh(amountSent.toString(16), 64)
                        };
                        console.log('txData==', txData);
                        txHex = await this.web3Serv.signTxWithPrivateKey(txData, keyPair);
                        // console.log('after sign');
                        if (doSubmit) {
                            // console.log('111');
                            const retEth = await this.apiServ.postEthTx(txHex);
                            txHash = retEth.txHash;
                            errMsg = retEth.errMsg;

                            if (txHash.indexOf('txerError') >= 0) {
                                errMsg = txHash;
                                txHash = '';
                            }
                        } else {
                            // console.log('333');
                            txHash = this.web3Serv.getTransactionHash(txHex);
                            // console.log('444');
                        }
                    } else
                    if (mycoin.tokenType === 'FAB') { // fab tokens
                            console.log('there we go =', satoshisPerBytes);
                            if (!gasPrice) {
                                gasPrice = environment.chains.FAB.gasPrice;
                            }
                            if (!gasLimit) {
                                gasLimit = environment.chains.FAB.gasLimit;
                            }
                            if (!satoshisPerBytes) {
                                satoshisPerBytes = environment.chains.FAB.satoshisPerBytes;
                            }
                            if (!bytesPerInput) {
                                bytesPerInput = environment.chains.FAB.bytesPerInput;
                            }
                            console.log('gasPrice final=', gasPrice);
                            let decimals = mycoin.decimals;
                            if (!decimals) {
                                decimals = 18;
                            }
                            // const amountSent = BigInt(amount * Math.pow(10, decimals));
                            // const amountSent = new BigNumber(amount).multipliedBy(new BigNumber(Math.pow(10, decimals)));
                            const amountSent = this.utilServ.toBigNumber(amount, decimals);
                            // const abiHex = this.web3Serv.getFabTransferABI([toAddress, amountSent.toString()]);

                            const funcTransfer: any = {
                                'constant': false,
                                'inputs': [
                                    {
                                        'name': 'to',
                                        'type': 'address'
                                    },
                                    {
                                        'name': 'value',
                                        'type': 'uint256'
                                    }
                                ],
                                'name': 'transfer',
                                'outputs': [
                                    {
                                        'name': '',
                                        'type': 'bool'
                                    }
                                ],
                                'payable': false,
                                'stateMutability': 'nonpayable',
                                'type': 'function'
                            };
                            // console.log('foreeeee');
                            console.log('amountSent=', amountSent);
                            console.log('toAddress===', toAddress);
                            amountInTx = new BigNumber(amountSent);
                            let fxnCallHex = this.web3Serv.getGeneralFunctionABI(funcTransfer, 
                                [this.utilServ.fabToExgAddress(toAddress), amountSent]);
                            // console.log('enddddd');
                            fxnCallHex = this.utilServ.stripHexPrefix(fxnCallHex);
                            let contractAddress = mycoin.contractAddr;
                            if (mycoin.name === 'EXG') {
                                contractAddress = environment.addresses.smartContract.EXG;
                            } else if (mycoin.name === 'DUSD') {
                                contractAddress = environment.addresses.smartContract.DUSD;
                            }

                            // const keyPair = this.getKeyPairs(mycoin, seed, 0, 0);

                            // contractAddress = '0x28a6efffaf9f721a1e95667e3de54c622edc5ffa';
                            contractAddress = this.utilServ.stripHexPrefix(contractAddress);
                            // console.log('contractAddress=' + contractAddress);

                            const totalAmount = gasLimit * gasPrice / 1e8;
                            console.log('totalAmount==', totalAmount);
                            // let cFee = 3000 / 1e8 // fee for the transaction

                            // console.log('fxnCallHex=' + fxnCallHex);
                            let totalFee = totalAmount;
                            const contract = Btc.script.compile([
                                84,
                                this.utilServ.number2Buffer(gasLimit),
                                this.utilServ.number2Buffer(gasPrice),
                                this.utilServ.hex2Buffer(fxnCallHex),
                                this.utilServ.hex2Buffer(contractAddress),
                                194
                            ]);

                            // console.log('contract=====', contract);
                            const contractSize = contract.toJSON.toString().length;

                            // console.log('contractSize=' + contractSize);
                            totalFee += this.utilServ.convertLiuToFabcoin(contractSize * 10);

                            // console.log('totalFee=' + totalFee);
                            console.log('satoshisPerBytessatoshisPerBytessatoshisPerBytes=', satoshisPerBytes);
                            const baseCoin = this.formMyCoin([{name: 'FAB', address: mycoin.receiveAdds[0].address}], 'FAB');
                            
                            console.log('baseCoin==', baseCoin);
                            baseCoin.tokenType = 'FAB';
                            console.log('totalFee==', totalFee);
                            const res1 = await this.getFabTransactionHex(seed, baseCoin, contract, 0, totalFee,
                                satoshisPerBytes, bytesPerInput, getTransFeeOnly);

                            baseCoin.tokenType = '';
                            // console.log('res1=', res1);
                            txHex = res1.txHex;
                            errMsg = res1.errMsg;
                            transFee = res1.transFee;
                            txids = res1.txids;
                            transFee = new BigNumber(transFee).dividedBy(new BigNumber(1e8)).toNumber();

                            if (getTransFeeOnly) {
                                return { txHex: '', txHash: '', errMsg: '', 
                                transFee: transFee, 
                                tranFeeUnit: mycoin.tokenType,
                                amountInTx: amountInTx, txids: txids };
                            }

                            if (txHex) {
                                if (doSubmit) {
                                    const res = await this.apiServ.postFabTx(txHex);
                                    txHash = res.txHash;
                                    errMsg = res.errMsg;
                                } else {
                                    const tx = Btc.Transaction.fromHex(txHex);
                                    txHash = '0x' + tx.getId();
                                }
                            }
                    }

                    else if (mycoin.name == 'TRX') {
                        console.log('start to send TRX');
            
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: feeLimit, 
                            tranFeeUnit: mycoin.name,
                            amountInTx: 0, txids: '' };
                        }            
                        const address1 = mycoin.receiveAdds[0];
                        const currentIndex = address1.index;            
                        const keyPair = this.getKeyPairs('TRX', seed, 0, currentIndex, 'b');;
                        let priKeyDisp = keyPair.privateKey.toString('hex');
            
                        
            
                        amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, 6));
                        const amountNum = amountInTx.toNumber();
            
                        const tradeobj = await tronWeb.transactionBuilder.sendTrx(toAddress, amountNum, keyPair.address);
            
                        const txHexObj = await tronWeb.trx.sign(tradeobj, priKeyDisp);
            
                        if (txHexObj) {
                            if (doSubmit) {
                                const receipt = await tronWeb.trx.sendRawTransaction(txHexObj);
                                txHex = txHexObj.raw_data_hex;
                                txHash = receipt.transaction.txID;
                                errMsg = '';
                            } else {
                                txHex = txHexObj.raw_data_hex;
                                txHash = txHexObj.txID;
            
                                const raw_dat_hex = txHexObj.raw_data_hex;
                                txHash = txHexObj.txID;
                                txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;
                                  
                            }
                        }
                    } else 
                    if (mycoin.tokenType == 'TRX') {
            
                        if (getTransFeeOnly) {
                            return { txHex: '', txHash: '', errMsg: '', 
                            transFee: feeLimit, 
                            tranFeeUnit: mycoin.tokenType,
                            amountInTx: 0, txids: '' };
                        }   
                        let coinName = mycoin.name;
                        if(mycoin.name == 'USDTX') {
                            coinName = 'USDT';
                        }           
                        const trc20ContractAddress = environment.addresses.smartContract[coinName]['TRX'];//contract address
                        const address1 = mycoin.receiveAdds[0];
                        const currentIndex = address1.index;            
                        const keyPair = this.getKeyPairs('TRX', seed, 0, currentIndex, 'b');
                        console.log('keyPairddd=', keyPair);
                        let priKeyDisp = keyPair.privateKey.toString('hex');
                        const tronWeb = new TronWeb(
                            fullNode,
                            solidityNode,
                            eventServer,
                            priKeyDisp
                        );

                        amountInTx = new BigNumber(this.utilServ.toBigNumber(amount, 6));
                        const amountNum = amountInTx.toNumber();            
                        
                        console.log('amountNum there we go=', amountNum);
                        
                        try {
                            let contract = await tronWeb.contract().at(trc20ContractAddress);
                            console.log('gogogo');
                            //Use call to execute a pure or view smart contract method.
                            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
                            if (doSubmit) {
            
                                txHash = await contract.transfer(
                                    toAddress, //address _to
                                    amountNum   //amount
                                ).send({
                                    feeLimit: Math.round(feeLimit * 1e6) 
                                });
                            } else {

            
                               const functionSelector = 'transfer(address,uint256)';
            
                               const options= {
                                   feeLimit: environment.chains.TRX.feeLimitToken,
                                   callValue: 0,
                                   userFeePercentage: 100,
                                   shouldPollResponse: false,
                                   from: tronWeb.address.toHex(keyPair.address)
                               };
                        
                               const parameters = [
                                   {
                                     type: 'address',
                                     value: tronWeb.address.toHex(toAddress).replace(ADDRESS_PREFIX_REGEX, '0x')
                                   },
                                   { type: 'uint256', value: amountNum }
                               ];
            
                                const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
                                    tronWeb.address.toHex(trc20ContractAddress),
                                   functionSelector,
                                   options,
                                   parameters,
                                   tronWeb.address.toHex(keyPair.address)
                               );
                        
                               const txHexObj = await tronWeb.trx.sign(transaction.transaction, priKeyDisp);
                               const raw_dat_hex = txHexObj.raw_data_hex;
                               txHash = txHexObj.txID;
                               txHex = '0a' + (raw_dat_hex.length / 2).toString(16) + '01' + raw_dat_hex + '1241' + txHexObj.signature;
                                console.log('txHex=', txHex);
                            }
                            
                            
                        } catch(error) {
                            console.error("trigger smart contract error",error)
                        }            
                    }
            

        const ret = { txHex: txHex, txHash: txHash, errMsg: errMsg, 
            transFee: transFee, tranFeeUnit: tranFeeUnit,
            amountInTx: amountInTx, txids: txids };
        console.log('ret there eeee=', ret);
        return ret;
    }    

    
}