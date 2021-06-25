import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../shared/services/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { IddockService } from '../../../shared/services/iddock.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-brand-add',
  providers: [],
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class StoreAddComponent implements OnInit {
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  smartContractAddress: string;
  coin: string;
  id: string;
  modalRef: BsModalRef;
  wallet: any;
  objectId: string;

  coins = ['DUSD', 'USDT'];

  constructor(
    private localSt: LocalStorage,
    private route: ActivatedRoute,
    private router: Router,
    private iddockServ: IddockService,
    private modalService: BsModalService,
    private utilServ: UtilService,
    private storeServ: StoreService) {
  }

  ngOnInit() {

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || !wallets.items || (wallets.items.length == 0)) {
        return;
      }
      const wallet = wallets.items[wallets.currentIndex];
      this.wallet = wallet;
    });

    this.currentTab = 'default';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.storeServ.getStore(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const store = res._body;
            this.objectId = store.objectId;
            this.name = store.name.en;
            this.nameChinese = store.name.sc;
            this.sequence = store.sequence;
            this.smartContractAddress = store.smartContractAddress;
            this.coin = store.coin;
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  async addStoreDo(seed: Buffer) {
    console.log('seed==', seed);
    const data = {
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      smartContractAddress: this.smartContractAddress,
      coin: this.coin,
      sequence: this.sequence ? this.sequence : 0
    };
    if (!this.id) {

      const { datahash, sign, txhex } = await this.iddockServ.signIdDock(seed, 'things', null, data, null);
      const newData = {
        ...data,
        datahash, 
        sign,
        txhex
      };
      this.storeServ.create(newData).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/stores']);
          }
        }
      );      
      /*
      (await this.iddockServ.addIdDock(seed, 'things', null, data, null)).subscribe(res => {
        console.log('ress=', res);
        if(res) {
          if(res.ok) {
            console.log('res.body._id=', res._body._id);
            this.objectId = this.utilServ.sequenceId2ObjectId(res._body._id.substring(0, 60));
            const newData = {
              ...data,
              objectId: this.objectId
            };
            this.storeServ.create(newData).subscribe(
              (res: any) => {
                if (res && res.ok) {
                  this.router.navigate(['/admin/stores']);
                }
              }
            );
          }
        }
      });
      */


    } else {

      this.storeServ.update(this.id, data).subscribe(
        async (res: any) => {
          console.log('res=', res);
          if (res.ok) {
            (await this.iddockServ.updateIdDock(seed, this.objectId, 'things', null, data, null)).subscribe(res => {
              if(res) {
                if(res.ok) {
                  this.router.navigate(['/merchant/stores']);
                }
              }
            });            
          }
        }
      );

    }
  }

  addStore() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.addStoreDo(seed);
    });

  }
}
