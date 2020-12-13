import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {Balance,  EthTransactionRes
    , FabTransactionResponse, CoinsPrice, BtcUtxo, KEthBalance, FabUtxo, EthTransactionStatusRes, GasPrice,
    FabTokenBalance, FabTransactionJson, BtcTransactionResponse, BtcTransaction} from '../../../interfaces/balance.interface';
import { HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(private http: HttpClient) {}
    
    async getBtcUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BTC.exchangily + 'getutxos/' + address;
        console.log('url in getBtcUtxos' + url);
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async postTx(coin, txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints[coin].exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

    async postBchTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.BCH.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

     async getEthNonce (address: string) {
        const url = environment.endpoints.ETH.exchangily + 'getnonce/' + address + '/latest';
        const response = await this.http.get(url).toPromise() as string;
        return Number (response);
    }

    async postEthTx(txHex: string) {
        // console.log('postEthTx here we go');
        // account for https://etherscan.io  keninqiu   82239^
        // token: M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB

        /*
        const url = environment.endpoints.ETH.etherscan + 'api?module=proxy&action=eth_sendRawTransaction&hex='
        + txHex + '&apikey=M5TN678RMY96HIZVKIAIK22WKQ6CN7R7JB';
        let response = null;
        if (txHex) {
            response = await this.http.get(url).toPromise() as EthTransaction;
        }
        console.log('response for postEthTx=');
        console.log(response);
        if (response) {
            if (response.result) {
                return response.result;
            }
            if (response.error && response.error.message) {
                this.alertServ.openSnackBar(response.error.message, 'Ok');
            }
        }
        */
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.ETH.exchangily + 'sendsignedtransaction';
        const data = {
            signedtx: txHex
        };
        if (txHex) {
            try {
                txHash = await this.http.post(url, data, {responseType: 'text'}).toPromise() as string;
            } catch (err) {
                console.log('errqqq=', err);
                if (err.error) {
                 errMsg = err.error;
                }
 
            }          
        }    

        return {txHash, errMsg};
    }

     async postDogeTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.DOGE.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }

     async postFabTx(txHex: string) {
        
        /*
        const url = 'http://fabtest.info:9001/fabapi/' + '/sendrawtransaction/' + txHex;
        console.log('txHex=' + txHex);
        console.log('url=' + url);
        let response = null;
        if (txHex) {
            response = await this.http.get(url).toPromise() as FabTransactionResponse;
        }
        console.log('response from postFabTx=');
        console.log(response);
        let ret = '';
        if (response && response.txid) {
            ret = '0x' + response.txid;
        }
        console.log('ret from postFabTx=' + ret);
        return ret;
        */
       const url = environment.endpoints.FAB.exchangily + 'postrawtransaction';

       // console.log('url here we go:', url);
       let txHash = '';
       let errMsg = '';
       const data = {
        rawtx: txHex
       };
       if (txHex) {
           try {
            const json = await this.http.post(url, data).toPromise() as FabTransactionResponse;
            console.log('json there we go=', json);
            if (json) {
                if (json.txid) {
                    txHash = json.txid;
                } else 
                if (json.Error) {
                    errMsg = json.Error;
                } 
            }
           } catch (err) {
               if (err.error && err.error.Error) {
                errMsg = err.error.Error;
                console.log('err there we go', err.error.Error);
               }

           }

       }       

       return {txHash, errMsg};
    }

     async getFabUtxos(address: string): Promise<[FabUtxo]> {
        const url = environment.endpoints.FAB.exchangily + 'getutxos/' + address;
        const response = await this.http.get(url).toPromise() as [FabUtxo];
        return response;
    }

     async postLtcTx(txHex: string) {
        let txHash = '';
        let errMsg = '';
        const url = environment.endpoints.LTC.exchangily + 'postrawtransaction';
        let response = null;
 
        const data = {
         rawtx: txHex
        };
 
        try {
             if (txHex) {
                 response = await this.http.post(url, data).toPromise() as BtcTransactionResponse;
             }
             if (response && response.txid) {
             txHash = '0x' + response.txid;
             }
        } catch (err) {
             if (err.error && err.error.Error) {
             errMsg = err.error.Error;
             console.log('err there we go', err.error.Error);
            }
        }
 
        //return ret;
        return {txHash, errMsg};
     }   

    async getUtxos(coin: string, address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints[coin].exchangily + 'getutxos/' + address;
        
        console.log('url in getBtcUtxos' + url);
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }

    async getBchUtxos(address: string): Promise<[BtcUtxo]> {
        const url = environment.endpoints.BCH.exchangily + 'getutxos/' + address;
        console.log('url in getBchUtxos' + url);
        let response = null;
        try {
            response = await this.http.get(url).toPromise() as [BtcUtxo];
        } catch (e) {console.log (e); }
        return response;
    }    
}