
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

// import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'qr-code',
    templateUrl: './qr-code.component.html',
    styleUrls: [
        './qr-code.component.scss',
    ]
})

export class QrCodeComponent implements OnInit {
    urlStores: string;  // 二维码地址
    urlWallet: string;
    urlMerchant: string;
    urlChef: string;
    
    // constructor(
    //     private http: HttpClient) {
    // }

    ngOnInit() {
        // this.dataServ.currentWallet.subscribe(
        //     (wallet: any) => {
        //         if(wallet) {
        //             this.wallet = wallet;
        //         }
        //     }
        // );
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: any) => {
        //         if(walletAddress) {
        //             this.walletAddress = walletAddress;
        //         }
        //     }
        // );

        const host = environment['API_PATH'];

        this.urlStores = `/stores`;
        this.urlWallet = `/wallet`;
        this.urlMerchant = `/merchant`;
        this.urlChef = `/chef/host/${host}`;
        // this.urlChef = `/chef`;

        // const httpOptions = {
        //     headers: new HttpHeaders({
        //         'accept': 'application/json'
        //     })
        // };
        // this.http.get('http://localhost:6060/health', httpOptions).subscribe(
        //     response => {
        //         console.log(response);
        //     },
        //     error => {
        //         console.error(error);
        //     }
        // );

    }

}
