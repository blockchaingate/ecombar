import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as bs58 from 'bs58';
import { environment } from '../../../../environments/environment';
import * as createHash from 'create-hash';

@Injectable({ providedIn: 'root' })
export class UtilService {
    auth_code = 'encrypted by crypto-js|';
    
    SHA256(data: string) {
        return CryptoJS.SHA256(data);
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

    aesDecryptSeed(encryted: any, pwd: string) {
        const decrytedString = this.aesDecrypt(encryted, pwd);
        if (decrytedString) {
            return Buffer.from(decrytedString, 'base64');
        }
        return null;
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