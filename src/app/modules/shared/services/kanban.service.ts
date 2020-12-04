import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';
import { KanbanGetBanalceResponse, KanbanNonceResponse, DepositStatusResp, TransactionAccountResponse } from '../../../interfaces/kanban.interface';


@Injectable({ providedIn: 'root' })
export class KanbanService {
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
    constructor(private http: HttpService) {
    }

    getKanbanBalance(address: string) {
        const path = this.baseUrl + 'kanban/getBalance/' + address;
        // console.log('path1=' + path);
        return this.http.getRaw(path);
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

    async getTransactionCount(address: string) {
        //return this.getNonce(address);

        let path = 'kanban/getTransactionCount/' + address; 
        path = this.baseUrl + path;
        // console.log('nouse in here:', path);
        const res = await this.http.getRaw(path).toPromise() as TransactionAccountResponse;
        return res.transactionCount;

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
            }                                            
        }
        const data = {
            btcAddress: btcAddress,
            ethAddress: ethAddress,
            fabAddress: fabAddress,
            bchAddress: bchAddress,
            dogeAddress: dogeAddress,
            ltcAddress: ltcAddress
        }

        const url = this.baseUrl + 'walletBalances';
        return this.http.postRaw(url, data, {});
    }
}