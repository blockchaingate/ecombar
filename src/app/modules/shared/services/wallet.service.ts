import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AuthService } from './auth.service';
import { UtilService } from './util.service';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';
import * as bip39 from 'bip39';
import * as BIP32 from 'node_modules/bip32';
import * as Btc from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
import { hdkey } from 'ethereumjs-wallet'
import * as bchaddr from 'bchaddrjs';
import * as wif from 'wif';
import { Wallet } from '../../../models/wallet';

@Injectable({ providedIn: 'root' })
export class WalletService {
    constructor(private utilServ: UtilService) {

    }

    initMyCoinAddresses(seed) {
        const allCoins = [];
        const coins = Object.getOwnPropertyNames(environment.CoinType);
        for(let i=0;i<coins.length;i++) {
            const coin = coins[i];
            const address = this.getKeyPairs(coin, seed, 0, 0, 'a');
            const item = {
                name: coin,
                address: address
            };
            allCoins.push(item);
        }

        return allCoins;
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

    validateMnemonic(mnemonic: string) {
        return bip39.validateMnemonic(mnemonic);
    }

    pwdStrength(pwd: string): string {
        const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~`\(\)!@#\$%\^&\*])(?=.{8,})');
        const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');
        if (strongRegex.test(pwd)) {
            return 'strong';
        } else if (mediumRegex.test(pwd)) {
            return 'medium';
        } else if (pwd.length > 4) {
            return 'week';
        } else {
            return 'invalid';
        }
    }

    generateWallet(pwd: string, name: string, mnemonic: string) {
        const mnemonicArr = mnemonic.split(' ');
        if (!mnemonicArr || mnemonicArr.length !== 12) {
            return null;
        }
        if (!this.validateMnemonic(mnemonic)) {
            return null;
        }
        const pwdValid = this.pwdStrength(pwd);
        if (pwdValid === 'strong' || pwdValid === 'medium') {
            const wallet = this.formatWallet(pwd, name, mnemonic);
            return wallet;
        } else {
            return null;
        }
        /*
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const myCoins = this.initMyCoins(seed);
        return myCoins;
        */
    }

    // Format wallet from input data.
    formatWallet(pwd: string, name: string, mnemonic: string) {
        const seed = bip39.mnemonicToSeedSync(mnemonic);

        // console.log('seed=');
        // console.log(seed);
        const seedHash = this.utilServ.SHA256(seed.toString());
        const seedHashStr = seedHash.toString();
        const pwdHashStr = this.utilServ.SHA256(pwd).toString();

        const encryptedSeed = this.utilServ.aesEncryptSeed(seed, pwd);
        const encryptedMnemonic = this.utilServ.aesEncrypt(mnemonic, pwd);
        const wallet = new Wallet(seedHashStr.substr(0, 8), name, pwdHashStr, encryptedSeed.toString(), encryptedMnemonic.toString());
        const addresses = this.initMyCoinAddresses(seed);

        wallet.addAddresses(addresses);
        return wallet;
    }

    generateMnemonic() {
        const words = bip39.generateMnemonic();
        return words;
    }    
}