import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';
import { KanbanGetBanalceResponse, KanbanNonceResponse, DepositStatusResp, TransactionAccountResponse } from '../../../interfaces/kanban.interface';
import { from } from 'rxjs';
import { UtilService } from './util.service';
import { Web3Service } from './web3.service';


@Injectable({ providedIn: 'root' })
export class KanbanService {
    nonces = new Map();
    baseUrl = environment.endpoints.kanban;
    //post https://kanbanprod.fabcoinapi.com/walletBalances
    /*
{
    "btcAddress":"1KABtfkukFSVVn9KLgCAJ9R4n15jRKQsyz",
    "ethAddress":"0x12c0b2ae16817d33b45e542c7590b9617ead6d44",
    "fabAddress":"1NyBkqKe3zqcSCpdZJZXk4eTF4oytQKaLJ",
    "bchAddress":"bitcoincash:qpzt202ltd670545mmd55h98zzwlf32ryyg6c3ad89",
    "dogeAddress":"DQ8jsAhfvBm8uMHDu6ytoYcMAdo5GQGbeU",
    "ltcAddress":"LNfTRKWKeeGxvQNvJAVuLW3TGzx8qkeoyT","timestamp":0}    
    */
    constructor(private http: HttpService, private utilServ: UtilService, private web3Serv: Web3Service) {
    }

    getKanbanBalance(address: string) {
        const path = this.baseUrl + 'kanban/getBalance/' + address;
        console.log('path1=' + path);
        return this.http.getRaw(path);
    }  

    getDepositStatusSync(txid: string) {
        txid = this.utilServ.stripHexPrefix(txid);
        return this.http.get(this.baseUrl + 'checkstatus/' + txid);
    }   
     
    getOrdersByAddressStatus(address: string, status: string, start: number = 0, count: number = 200) {
        let path = 'ordersbyaddresspaged/' + address + '/' + start + '/' + count + '/' + status;
        path = environment.endpoints.kanban + path;
        console.log('path for getOrdersByAddress=' + path);
        const res = this.http.get(path);
        return res;
    }
 
    getTransactionStatusSync(txid: string) {
        return this.http.get(this.baseUrl + 'kanban/getTransactionReceipt/' + txid);
    }
        
    getBalance(address: string) {
        const url = 'exchangily/getBalances/' + address;
        return this.http.getRaw(this.baseUrl + url);
    }
    
    async kanbanCallAsync(to: string, abiData: string) {
        const res = await this.kanbanCall(to, abiData).toPromise();
        return res;
    }


    kanbanCall(to: string, abiData: string) {
        const data = {
            transactionOptions: {
                to: to,
                data: abiData
            }
        };
        const path = this.baseUrl + 'kanban/call';
        const res = this.http.postRaw(path, data);
        return res;        
    }
    
    kanbanSend(to: string, abiData: string) {
        const txhex = '';   
        return this.sendRawSignedTransaction(txhex);   
    }

    getTransactionReceipt(txid: string) {
        const path = this.baseUrl + 'kanban/gettransactionreceipt/' + txid;
        return this.http.getRaw(path);
    }
    
    signJsonData(privateKey: any, data: any) {

        var queryString = Object.keys(data).filter((k) => (data[k] != null) && (data[k] != undefined))
        .map(key => key + '=' + (typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]))).sort().join('&');

        //const test = this.web3Serv.signMessageTest(queryString, privateKey);
        const signature = this.web3Serv.signKanbanMessageWithPrivateKey(queryString, privateKey);
        //console.log('signature here=', signature);
        return signature;  
    }

    submitDeposit(rawTransaction: string, rawKanbanTransaction: string) {
        const data = {
            'rawTransaction': rawTransaction,
            'rawKanbanTransaction': rawKanbanTransaction
        };
        const httpHeaders = new HttpHeaders({
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        });
        const options = {
            headers: httpHeaders
        };
        // console.log('data for submitDeposit=', data);       
        const path = this.baseUrl + 'submitDeposit';
        return this.http.postRaw(path, data, options);
    }

    sendRawSignedTransaction(txhex: string) {
        const data = {
            signedTransactionData: txhex
        };
        return this.http.postRaw(this.baseUrl + 'kanban/sendRawTransaction', data);
    }

    async sendRawSignedTransactionPromise(txhex: string) {
        const url = environment.endpoints.blockchaingate + 'kanban/sendRawTransaction' ;
        //const url = this.baseUrl + 'kanban/sendRawTransaction';
        const data = {
            signedTransactionData: txhex,
        };
        let resp;
        try {
            resp = await this.http.postRaw(url, data).toPromise();
        } catch (e) {
        }

        return resp;
    }

    async getCoinPoolAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'exchangily/getCoinPoolAddress';
        path = this.baseUrl + path;
        let addr = '';
        try {
            addr = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        } catch (e) {
        }

        return addr;
    }

    async getRecordAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'ecombar/getIddockAddress'; 
        path = this.baseUrl + path;
        // console.log('nouse in here:', path);
        const res = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        return res;
    }
    
    async getTransactionCount(address: string) {
        //return this.getNonce(address);
        let nonce = this.nonces.get('address');
        if(nonce) {
            nonce ++;
            this.nonces.set(address, nonce);
            console.log('address1===', address);
            console.log('nonce1===', nonce);
            return nonce;
        }
        let path = 'kanban/getTransactionCount/' + address; 
        path = this.baseUrl + path;
        console.log('nonce in here:', path);
        const res = await this.http.getRaw(path).toPromise() as TransactionAccountResponse;
        nonce = res.transactionCount;
        this.nonces.set(address, nonce);
        console.log('address2===', address);
        console.log('nonce2===', nonce);
        return nonce;

    }

    getExchangeBalance(address) {
        const path = this.baseUrl + 'exchangily/getBalances/' + address;
        return this.http.getRaw(path);        
    }

    async getScarAddress() {
        const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
        let path = 'kanban/getScarAddress';
        path = this.baseUrl + path;
        const addr = await this.http.getRaw(path, { headers, responseType: 'text' }).toPromise() as string;
        return addr;
    }    


    getWalletBalances(addresses: any) {
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
            } else   
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

        const url = this.baseUrl + 'walletBalances';
        return this.http.postRaw(url, data, {});
    }
}