import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { CoinService } from './coin.service';
import { UtilService } from './util.service';
import { User } from '../models/user';
import { environment } from '../../../../environments/environment';
import * as bip39 from 'bip39';
import * as BIP32 from 'node_modules/bip32';
import * as Btc from 'bitcoinjs-lib';
import * as bitcoinMessage from 'bitcoinjs-message';
//import { hdkey } from 'ethereumjs-wallet'
import * as hdkey from 'ethereumjs-wallet/hdkey';
import * as bchaddr from 'bchaddrjs';
import * as wif from 'wif';
import { Wallet } from '../../../models/wallet';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { DataService } from './data.service';
import { MerchantService } from './merchant.service';
import { StoreService } from './store.service';

@Injectable({ providedIn: 'root' })
export class WalletService {
    constructor(

    private dataServ: DataService,
    private storeServ: StoreService,
        private localSt: LocalStorage, private utilServ: UtilService, private coinServ: CoinService) {

    }

    initMyCoinAddresses(seed) {
        const allCoins = [];
        const coins = Object.getOwnPropertyNames(environment.CoinType);
        for(let i=0;i<coins.length;i++) {
            const coin = coins[i];
            const address = this.coinServ.getKeyPairs(coin, seed, 0, 0, 'a');
            const item = {
                name: coin,
                address: address
            };
            allCoins.push(item);
        }

        return allCoins;
    }


    updateWalletPassword(wallet: Wallet, oldPassword: string, newPassword: string) {
        const pwdHashStr = this.utilServ.SHA256(newPassword).toString();
        const  mnemonic = this.utilServ.aesDecrypt(wallet.encryptedMnemonic, oldPassword);
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        const encryptedMnemonic = this.utilServ.aesEncrypt(mnemonic, newPassword);   
        const encryptedSeed = this.utilServ.aesEncryptSeed(seed, newPassword);
        wallet.pwdHash = pwdHashStr;
        wallet.encryptedMnemonic = encryptedMnemonic;
        wallet.encryptedSeed = encryptedSeed;
        return wallet;
    }

    updateToWalletList(wallet: Wallet, index: number) {

        this.localSt.getItem('ecomwallets').subscribe((wallets: Wallet[]) => {
            if (!wallets) {
                wallets = [];
            }
            if (wallets && wallets.length > 0) {
                wallets[index] = wallet;
            }

            this.localSt.setItem('ecomwallets', wallets).subscribe(() => {
            });
        });
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

    updateWallets(wallets) {
        return this.localSt.setItem('ecomwallets', wallets);
    }    

    refreshWallets(wallets: any) {
        this.dataServ.changeWallets(wallets);
        const wallet = wallets.items[wallets.currentIndex];
        this.dataServ.changeWallet(wallet);
        const addresses = wallet.addresses;
        const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
        const walletAddress = walletAddressItem.address;
        if(walletAddress) {
          this.dataServ.changeWalletAddress(walletAddress); 

          this.storeServ.getStoresByAddress(walletAddress).subscribe(
            (ret: any) => {
              console.log('ret in app=', ret);
              if(ret && ret.length > 0) {
                const store = ret[0];
                console.log('store===', store);
                this.dataServ.changeMyStore(store);
              }
            });

        }
    }
}