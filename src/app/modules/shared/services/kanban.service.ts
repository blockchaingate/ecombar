import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

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