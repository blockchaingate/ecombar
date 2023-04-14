
import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    qrResult: string;
    scanActive = false;

    // constructor() {}
    constructor(
        private alertController: AlertController,
        // private barcodeScanner: BarcodeScanner,
        private router: Router) { 
    }

    ngOnInit(): void {
        this.qrResult = "";
    }

    ngAfterViewInit() {
        BarcodeScanner.prepare();
    }

    ngOnDestroy() {
        BarcodeScanner.stopScan();
    }

    async startScanner() {
        const allowed = await this.checkPermission();
        if (allowed) {
            this.scanActive = true;
            const result = await BarcodeScanner.startScan();
            if (result.hasContent) {
                this.qrResult = result.content;
                this.scanActive = false;

                this.router.navigate([result.content]);  // 站内跳转
            } else {
                this.qrResult = "Err !";
            }
        }
    }

    async stopScanner() {
        await BarcodeScanner.stopScan();
        this.scanActive = false;
    }

    async checkPermission() {
        return new Promise( async (resolve, reject) => {
            const status = await BarcodeScanner.checkPermission({ force: true });
            if (status.granted) {
                resolve(true);
            } else if (status.denied) {
                const alert = await this.alertController.create({
                    header: 'No permission',
                    message: 'Please allow camera access in your settings',
                    buttons: [{
                        text: 'No',
                        role: 'cancel'
                    },
                    {
                        text: 'Open Settings',
                        handler: () => {
                            BarcodeScanner.openAppSettings();
                            resolve(false);
                        }
                    }],
                });
                await alert.present();
            } else {
                resolve(false);
            }
        });
    }
}
