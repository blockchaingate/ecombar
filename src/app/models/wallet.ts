import { MyCoin} from './mycoin';
import { CoinAddress} from './coin-address';

export class Wallet {
    id: string; // first 8 chars of hash value of seed.
    hide: boolean;
    name: string;
    pwdHash: string; // pwd - encrypt seed, resetable.
    pwdDisplayHash: string; // display password
    pinHash?: string; // pin - encrypt other data and confirm payment, resetable.
    encryptedSeed: string; // Encrypted with pwd.
    encryptedMnemonic: string; // Encrypted with pwd
    addresses: CoinAddress[];
    mycoins: MyCoin[]; // My tokens
    dateCreated: Date;
    lastUpdated: Date;

    constructor(seedHashShort: string, name: string, pwdhash: string, encryptedSeed: string, encryptedMnemonic: string) {
        this.id = seedHashShort;
        this.hide = false;
        this.name = name;
        this.pwdHash = pwdhash;
        this.encryptedSeed = encryptedSeed;
        this.encryptedMnemonic = encryptedMnemonic;
        this.mycoins = new Array();
        this.addresses = new Array();
        this.dateCreated = new Date();
        this.lastUpdated = new Date();   
    }

    // Add a coin to coins, duplication prevented.
    addCoin(coin: MyCoin) {
        if (this.mycoins.indexOf(coin) < 0) {
            this.mycoins.push(coin);
        }
    }

    // Add an array of coins into coins, duplication prevented.
    addCoins(coins: MyCoin[]) {
        coins.forEach(coin => {
            this.addCoin(coin);
            this.lastUpdated = new Date();
        });
    }

    // Add a coin to coins, duplication prevented.
    addAddress(address: CoinAddress) {
        if (this.addresses.indexOf(address) < 0) {
            this.addresses.push(address);
        }
    }

    // Add an array of coins into coins, duplication prevented.
    addAddresses(addresses: CoinAddress[]) {
        addresses.forEach(address => {
            this.addAddress(address);
            this.lastUpdated = new Date();
        });
    }    
}
