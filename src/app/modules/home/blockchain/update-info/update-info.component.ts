import { Component, OnInit, TemplateRef } from '@angular/core';
import { IddockService } from '../../../shared/services/iddock.service';
import {ActivatedRoute, Router} from '@angular/router';
import { UtilService } from '../../../shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-update-info',
  templateUrl: './update-info.component.html',
  styleUrls: ['./update-info.component.scss']
})
export class UpdateInfoComponent implements OnInit {
  id: string;
  type: string;
  data: any;
  saveSuccess: boolean;
  wallet: any;
  walletAddress: string;
  password: string;
  hash: string;
  passwordWrong: boolean;
  modalRef: BsModalRef;
  saveErr: string;

  _hasParents: boolean;
  get hasParents(): boolean {
      return this._hasParents;
  }
  set hasParents(value: boolean) {
      this._hasParents = value;
      console.log('value for hasParents=', value);
      if(value) {
        if(!this.data.parents) {
          this.data.parents = [
            {
              _id: '',
              qty: 0,
              typ: ''
            }
          ];
          console.log('parents=', this.data.parents);
        }
      }
  }


  constructor(
    private localSt: LocalStorage, 
    private modalService: BsModalService, 
    private route: ActivatedRoute, 
    private router: Router,
    private iddockServ: IddockService, 
    public utilServ: UtilService) { }

    addParentItem() {
      this.data.parents.push(
        {
          _id: '',
          qty: 0,
          typ: ''
        }    
      );
    }

  ngOnInit() {

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || !wallets.items || (wallets.items.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      
      this.loadWallet();

    });  

    this.type = this.route.snapshot.paramMap.get('type');
    this.id = this.route.snapshot.paramMap.get('id');
    this.iddockServ.getDetail(this.type, this.id).subscribe(
      (ret: any) => {
        console.log('rettttt=', ret);
        if(ret && ret.ok) {
          this.data = ret._body;
          /*
          const nvs = [];

          
          this.data.nvs.forEach(element => {
            const name = element.name;
            const value = element.value;
            nvs.push({name: name, value:JSON.stringify(value)});
          });

          this.data.nvs = nvs;
          */
        }
      }
    );    
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.walletAddress = walletAddressItem.address;
  }

  deleteItem(item) {
    this.data.nvs = this.data.nvs.filter(pair => pair != item);
  }

  deleteParentItem(item) {
    this.data.parents = this.data.parents.filter(parentItem => parentItem != item);
  }
  
  addItem() {
    const item = {
      name: '',
      value: '',
      type: 0
    };
    this.data.nvs.push(
      item
    );
  }

  openModal(template: TemplateRef<any>) {  
    this.modalRef = this.modalService.show(template);
  }  

  history(type: string, item: any) {
    this.router.navigate(['/blockchain/history/' + type + '/' + this.id]);
  }

  detail(type: string, item: any) {
    this.router.navigate(['/blockchain/detail/' + type + '/' + this.id]);
  }
  async update() {

    console.log('this.data for update=', this.data);



    const seed = this.utilServ.aesDecryptSeed(this.wallet.encryptedSeed, this.password);    

    /*
    console.log('this.data=', this.data);
    let nonce = parseInt(this.data._id.substring(42));
    if(!nonce) {
      nonce = 0;
    }
    const sequance = this.data._id.substring(0,42) + (nonce + 1).toString(16);
    */

   const nvs = [];


   console.log('this.data.nvs===', this.data.nvs);
    (await this.iddockServ.updateIdDock(seed, this.id, this.type, this.data.rfid, this.data.nvs, this.data.parents)).subscribe(res => {
      if(res) {
        if(res.ok) {
          this.saveSuccess = true;
          //this.myid = this.utilServ.exgToFabAddress(res._body._id.substring(0, 42));
          this.saveErr = '';
        } else {
          //this.myid = '';
          this.saveSuccess = false;
          this.saveErr = 'Error while updating id';
        }
        
      }
    });

  }

  confirmPassword() {
    const pinHash = this.utilServ.SHA256(this.password).toString();
    if (pinHash !== this.wallet.pwdHash) {
        this.warnPwdErr();
        return;
    }
    this.modalRef.hide();
    this.update();
  }

  warnPwdErr() {
      this.passwordWrong = true;
  }   


}
