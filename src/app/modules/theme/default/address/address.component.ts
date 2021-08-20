import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AddressService } from 'src/app/modules/shared/services/address.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  
})
export class AddressComponent implements OnInit {
  suite: string;
  streetNumber: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postcode: string;
  country: string;
  order: any;
  id: string;
  storeId: string;
  orderID: string;
  noWallet: boolean;
  password: string;
  wallets: any;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private iddockServ: IddockService,
    private spinner: NgxSpinnerService,
    private dataServ: DataService,
    private localSt: LocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private userServ: UserService,
    private orderServ: OrderService,
    private addressServ: AddressService) {

  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        if(wallet) {
          this.wallet = wallet;
        }
      }
    );

    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        this.storeId = storeId;
      }
    );
    /*
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || !wallets.items || (wallets.items.length == 0)) {
        this.noWallet = true;
        return;
      }
      this.wallets = wallets;
      console.log('this.wallets==', this.wallets);
      this.wallet = this.wallets.items[this.wallets.currentIndex];
    });  
    */
    this.orderID = this.route.snapshot.paramMap.get('orderID');
    this.orderServ.get(this.orderID).subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.order = res._body;
          console.log('this.order====', this.order);
        }
      }
    );
    this.userServ.getMe().subscribe(
      (res: any) => {
        console.log('resme==', res);
        if (res && res.ok) {
          const member = res._body;
          if (member.homeAddressId) {
            this.id = member.homeAddressId;
            this.addressServ.getAddress(member.homeAddressId).subscribe(
              (res: any) => {
                console.log('res for addressss=', res);
                if (res && res.ok) {
                  const address = res._body;
                  this.suite = address.suite;
                  this.streetNumber = address.streetNumber;
                  this.street = address.street;
                  this.district = address.district;
                  this.city = address.city;
                  this.province = address.province;
                  this.postcode = address.postcode;
                  this.country = address.country;
                  console.log('res  for address=', res);
                }
              }
            );
          }
        }

      }
    );
  }

  updateOrderAddress() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
      this.updateOrderAddressDo(seed);
    });    
    //this.ngxSmartModalServ.getModal('passwordModal').open();

  }


  async updateOrderAddressDo(seed: Buffer) {
    const updatedOrder = {
      unit: this.suite,
      streetNumber: this.streetNumber,
      streetName: this.street,
      city: this.city,
      province: this.province,
      zip: this.postcode,
      country: this.country
    };

    const updatedOrderForIdDock = {
      merchantId: this.order.merchantId,
      items: this.order.items,
      currency: this.order.currency,
      transAmount: this.order.transAmount,
      ...updatedOrder
    };    

    (await this.iddockServ.updateIdDock(seed, this.order.objectId, 'things', null, updatedOrderForIdDock, null)).subscribe(res => {
      if(res) {
        if(res.ok) {
          
          this.orderServ.update2(this.orderID, updatedOrder).subscribe(
            (res: any) => {
              if (res && res.ok) {
                //this.addAddress();
                this.spinner.hide();
                this.router.navigate(['/store/'+ this.storeId + '/payment/' + this.orderID]);
              }
            }
          );
        } else {

        }
        
      }
    });



  }

  confirm() {
    this.updateOrderAddress();
  }
  
  addAddress() {

    const address = {
      suite: this.suite,
      streetNumber: this.streetNumber,
      street: this.street,
      district: this.district,
      city: this.city,
      province: this.province,
      postcode: this.postcode,
      country: this.country
    };


    if (this.id) {
      this.addressServ.updateAddress(this.id, address).subscribe(
        (res: any) => {
          console.log('res for updateAddress', address);
          if (res && res.ok) {
            this.router.navigate(['/payment/' + this.orderID]);
          }
        }
      );
    } else {
      this.addressServ.addAddress(address).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const _body = res._body;
            const addressId = _body._id;
            const body = {
              homeAddressId: addressId
            }
            this.userServ.updateSelf(body).subscribe(
              (res: any) => {
                console.log('res for updateSelf=', res);
                if (res && res.ok) {
                  this.router.navigate(['/payment/' + this.orderID]);
                }
              }
            );
          }
          console.log('res for addAddress', address);
        }
      );
    }
  }
}