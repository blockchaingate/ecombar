import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as bs58 from 'bs58';
import { environment } from '../../../../environments/environment';
import * as createHash from 'create-hash';
import BigNumber from 'bignumber.js/bignumber';
import { coin_list } from '../../../../environments/coins';
import { MyCoin } from '../../../models/mycoin';

@Injectable({ providedIn: 'root' })
export class UtilService {
    auth_code = 'encrypted by crypto-js|';
    
    SHA256(data: string) {
        return CryptoJS.SHA256(data);
    }

    getDecimal(coin: MyCoin) {
        if (coin.decimals) {
            return coin.decimals;
        }
        if (coin.name === 'ETH') {
            return 18;
        }
        return 8;
    }

    fixedLengh(obj: any, length: number) {
        let str = obj.toString();
        const strLength = str.length;
        if (strLength >= length) {
            str = str.substring(strLength - length);
            // console.log(str);
            return str;
        }
        for (let i = 0; i < length - strLength; i++) {
            str = '0' + str;
        }
        return str;
    }

    convertLiuToFabcoin(amount) {

        return Number(Number(amount * 1e-8).toFixed(8));
    }

    hex2Buffer(hexString) {
        const buffer = [];
        for (let i = 0; i < hexString.length; i += 2) {
            buffer[buffer.length] = (parseInt(hexString[i], 16) << 4) | parseInt(hexString[i + 1], 16);
        }
        return Buffer.from(buffer);
    }
    
    number2Buffer(num) {
        const buffer = [];
        const neg = (num < 0);
        num = Math.abs(num);
        while (num) {
            buffer[buffer.length] = num & 0xff;
            num = num >> 8;
        }

        const top = buffer[buffer.length - 1];
        if (top & 0x80) {
            buffer[buffer.length] = neg ? 0x80 : 0x00;
        } else if (neg) {
            buffer[buffer.length - 1] = top | 0x80;
        }
        return Buffer.from(buffer);
    }   

    toBigNumber(amount, decimal: number) {
        if (amount === 0 || amount === '0') {
            return '0';
        }
        const amountStr = amount.toString();
        const amountArr = amountStr.split('.');
        const amountPart1 = amountArr[0];
        const numPart1 = Number(amountPart1);
        let amountPart2 = '';
        if (amountArr[1]) {
            amountPart2 = amountArr[1].substring(0, decimal);
        }

        const amountPart2Length = amountPart2.length;
        if (decimal > amountPart2Length) {
            for (let i = 0; i < decimal - amountPart2Length; i++) {
                amountPart2 += '0';
            }
        }

        let amountStrFull = (numPart1 ? amountPart1 : '') + amountPart2;
        amountStrFull = amountStrFull.replace(/^0+/, '');
        return amountStrFull;
    }

    
    aesEncrypt(messageToEnc: string, pwd: string) {
        const encrypted = CryptoJS.AES.encrypt(this.auth_code + messageToEnc, pwd).toString();
        return encrypted;
        // return encrypted.toString();
    }

    aesDecrypt(encryted: any, pwd: string) {
        try {
            const encryptedRawData = CryptoJS.AES.decrypt(encryted, pwd).toString(CryptoJS.enc.Utf8);
            if (!encryptedRawData.startsWith(this.auth_code)) {
                // return '';
                return encryptedRawData;
            }
            return encryptedRawData.slice(this.auth_code.length);
        } catch (e) { }
        return '';
    }

    toPrecision(num: number) {
        return Math.round(num * 10000) / 10000;
    }

    aesEncryptSeed(seed: Buffer, pwd: string) {
        const seedString = seed.toString('base64');
        return this.aesEncrypt(seedString, pwd);
    }

    showAmount(amount, decimal: number) {

        if (!amount || amount.toString() === '0') {
            return '0';
        }

        const bigN = new BigNumber(amount).dividedBy(new BigNumber(1e18));

        const fixedString = bigN.toFixed(decimal);

        const fixN = fixedString.slice(0, (fixedString.indexOf('.')) + decimal + 1);
        return fixN;
    }

    toNumber(num) {
        return Number(num);
    }
        
    aesDecryptSeed(encryted: any, pwd: string) {
        const decrytedString = this.aesDecrypt(encryted, pwd);
        if (decrytedString) {
            return Buffer.from(decrytedString, 'base64');
        }
        return null;
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

    fabToExgAddress(address: string) {
        const bytes = bs58.decode(address);
        const addressInWallet = bytes.toString('hex');
        console.log('addressInWallet==', addressInWallet);
        return '0x' + addressInWallet.substring(2, 42);
    }

    exgToFabAddress(address: string) {
        let prefix = '6f';
        if (environment.production) {
            prefix = '00';
        }
        address = prefix + this.stripHexPrefix(address);

        let buf = Buffer.from(address, 'hex');

        const hash1 = createHash('sha256').update(buf).digest().toString('hex');
        const hash2 = createHash('sha256').update(Buffer.from(hash1, 'hex')).digest().toString('hex');

        buf = Buffer.from(address + hash2.substring(0, 8), 'hex');
        address = bs58.encode(buf);

        return address;
    }    

    stripHexPrefix(str) {
        if (str && (str.length > 2) && (str[0] === '0') && (str[1] === 'x')) {
            return str.slice(2);
        }
        return str;
    } 
    
    hexToDec(hex: string) {
        if (hex.length === 1) {
            return this.hexCharToDec(hex);
        }
        const leftHex = hex.slice(0, hex.length - 1);
        const rightHex = hex.slice(-1);
        // console.log('leftHex=' + leftHex);
        // console.log('rightHex=' + rightHex);
        return this.hexToDec(leftHex) * 16 + this.hexCharToDec(rightHex);
    }   
    
    hexCharToDec(hexChar: string) {
        return parseInt(hexChar, 16);
    }    
}