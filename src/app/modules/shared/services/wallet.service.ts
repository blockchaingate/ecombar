import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';
import * as bip39 from 'bip39';
import * as BIP32 from 'node_modules/bip32';
import * as Btc from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import { hdkey } from 'ethereumjs-wallet'
import * as bchaddr from 'bchaddrjs';
import * as wif from 'wif';

@Injectable({ providedIn: 'root' })
export class WalletService {
    constructor() {

    }

    initMyCoins(seed) {

        const coins = Object.getOwnPropertyNames(environment.CoinType);
        for(let i=0;i<coins.length;i++) {
            const coin = coins[i];
            let address = this.getKeyPairs(coin, seed, 0, 0, 'a');
            console.log('coin=' + coin + ',address=', address);
        }

        return 'myCoins';
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
        } else

            if (name === 'ETH') {

                const root = hdkey.fromMasterSeed(seed);
                const childNode = root.derivePath(path);

                const wallet = childNode.getWallet();
                const address = `0x${wallet.getAddress().toString('hex')}`;
                addr = address;
                buffer = wallet.getPrivateKey();
                priKey = wallet.getPrivateKey();
                priKeyDisp = buffer.toString('hex');

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
       }
       return '';
    }

    generateWallet(mnemonic: string) {
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const myCoins = this.initMyCoins(seed);
        return myCoins;
    }

    generateMnemonic() {
        const words = bip39.generateMnemonic();
        return words;
    }    
}