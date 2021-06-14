import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from '../../../shared/services/util.service';
import { CoinService } from '../../../shared/services/coin.service';
import { Web3Service } from '../../../shared/services/web3.service';
import { IddockService } from '../../../shared/services/iddock.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../store/states/user.state';
import { updateWalletExgAddress } from '../../../../store/actions/user.actions';
import { ToastrService } from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-admin-merchant-info',
  providers: [],
  templateUrl: './merchant-info.component.html',
  styleUrls: ['./merchant-info.component.scss']
})
export class MerchantInfoComponent implements OnInit{
    name: string;
    password: string;
    wallets: any;
    wallet: any;
    walletExgAddress: string;

    constructor(
      private userServ: UserService,
      private localSt: LocalStorage,
      private toastr: ToastrService,
      private coinServ: CoinService,
      private translateServ: TranslateService,
      private iddockServ: IddockService,
      private store: Store<{ user: UserState }>,
      private web3Serv: Web3Service,
      private ngxSmartModalServ: NgxSmartModalService,
      private utilServ: UtilService) {
    }

    ngOnInit() {

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

            if(!wallets || !wallets.items || (wallets.items.length == 0)) {
              return;
            }
            this.wallets = wallets;
            console.log('this.wallets==', this.wallets);
            this.wallet = this.wallets.items[this.wallets.currentIndex];

    
        });

        this.userServ.getMe().subscribe(
            (res: any) => {
                console.log('res==', res);
                if(res && res.ok) {
                    const merchant = res._body.defaultMerchant;
                    if(merchant) {
                        this.name = merchant.name;
                        this.walletExgAddress = merchant.walletExgAddress;
                    }
                }
            }
        );
    }

    update() {
        //this.ngxSmartModalServ.getModal('passwordModal').open();
        this.onConfirmPassword(null);

    }

    async onConfirmPassword(event) {

        /*
        this.ngxSmartModalServ.getModal('passwordModal').close();
        this.password = event;

        const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password);


        const nvs = [];
        nvs.push(
            {
                name: 'name',
                value: this.name
            }
        );

        nvs.push(
            {
                name: 'walletExgAddress',
                value: this.walletExgAddress
            }
        );        
        
        const nvsString = JSON.stringify(nvs);
        const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        
        const nonce = 0;
        //const id = keyPairsKanban.publicKey + '_' + nonce;
        const id = keyPairsKanban.publicKey.substring(0, 20) + '_' + nonce;
        const selfSign = this.coinServ.signedMessage(nvsString, keyPairsKanban);
        const selfSignString = this.utilServ.stripHexPrefix(selfSign.r)  + this.utilServ.stripHexPrefix(selfSign.s) + this.utilServ.stripHexPrefix(selfSign.v);
        const datahash = this.web3Serv.getHash(nvsString);

        const data = {
            _id: id,
            selfSign: selfSignString,
            nvs: nvs,
            datahash: datahash,
            txhex: ''
        }
        */
        const item = {
            name: this.name,
            walletExgAddress: this.walletExgAddress
        };
        this.userServ.updateSelfMerchant(item).subscribe(
            (res: any) => {
                if(res && res.ok) {
                    const body = res._body;
                    this.store.dispatch(updateWalletExgAddress({newWalletExgAddress: this.walletExgAddress}));
                    this.toastr.success(this.translateServ.instant('Good job'));
                }
            }
        );        
    }
}