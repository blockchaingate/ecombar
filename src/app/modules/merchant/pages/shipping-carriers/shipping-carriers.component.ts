import { Component, OnInit } from '@angular/core';
import { ShippingCarrierService } from 'src/app/modules/shared/services/shipping-carrier.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Router } from '@angular/router';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';


@Component({
    selector: 'app-admin-shipping-carriers',
    providers: [],
    templateUrl: './shipping-carriers.component.html',
    styleUrls: ['./shipping-carriers.component.scss']
  })
  export class ShippingCarriersComponent implements OnInit{
    shippingCarriers: any;
    wallet: any;
    modalRef: BsModalRef;
    constructor(
      public kanbanServ: KanbanService,
      private modalService: BsModalService,
      private dataServ: DataService,
      private router: Router,
      private shippingCarrierServ: ShippingCarrierService) {
  
    }
  
    ngOnInit() {
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          if(walletAddress) {
            this.getMerchantShippingCarriers(walletAddress);
          }
          
        }
      );
      this.dataServ.currentWallet.subscribe(
        (wallet: string) => {
          this.wallet = wallet;
        }
      ); 
    }
    getMerchantShippingCarriers(walletAddress: string) {
      this.shippingCarrierServ.getMerchantShippingCarriers(walletAddress).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.shippingCarriers = res._body;
          }
        }
      );
    }
  
    editShippingCarrier(shippingCarrier_id: string) {
      this.router.navigate(['/merchant/shipping-carrier/' + shippingCarrier_id + '/edit']);
    }
  
    deleteShippingCarrier(shippingCarrier_id) {
  
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      if(!this.wallet || !this.wallet.pwdHash) {
        this.router.navigate(['/wallet']);
        return;
      }
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.deleteShippingCarrierDo(privateKey, shippingCarrier_id);
      });
    }
  
    deleteShippingCarrierDo(privateKey: any, shippingCarrier_id: string) {
      const data = {
        id: shippingCarrier_id
      };
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;        
      this.shippingCarrierServ.deleteShippingCarrier(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.shippingCarriers = this.shippingCarriers.filter((item) => item._id != shippingCarrier_id);
          }
        }
      );
    }
  }
