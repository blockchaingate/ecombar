import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { IddockService } from '../../shared/services/iddock.service';
import { DataService } from '../../shared/services/data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../shared/components/password-modal/password-modal.component';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0
import { KanbanService } from '../../shared/services/kanban.service';
import { CoinService } from '../../shared/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { compilerOperationSigningSerializationLocktime } from '@bitauth/libauth';

// 定义验证规则：FormBuilder 构建表单数据，FormGroup 表单类型，Validators 表单验证
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    template: ''
})
export abstract class AddressComponent implements OnInit {
  suite: string;
  streetNumber: string;
  street: string;
  name: string;
  buyerPhone: string;
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
  addresses: any;
  modalRef: BsModalRef;
  workForm: FormGroup;    // 定义表单

  // 添加 fb 属性，用来创建表单
  // constructor(private fb: FormBuilder) { }
  constructor(
    private fb: FormBuilder,  // 添加 fb 属性，用来创建表单
    private cd: ChangeDetectorRef,  // 变更检测 detectChanges()
    private modalService: BsModalService,
    private iddockServ: IddockService,
    // private spinner: NgxSpinnerService,
    private dataServ: DataService,
    private coinServ: CoinService,
    private router: Router,
    private kanbanServ: KanbanService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private orderServ: OrderService,
    private addressServ: AddressService) {

  }

    ngAfterContentChecked() {    // 使用 ngAfterViewInit, ngAfterContentInit 无效
        this.cd.detectChanges();  // 变更检测 detectChanges()
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

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.addressServ.getAddresses(walletAddress).subscribe(
            (ret: any) => {
              if(ret) {
                this.addresses = ret;

                this.orderServ.get(this.orderID).subscribe(
                  (res: any) => {
                    if(res) {
                      this.order = res;
                      this.suite = this.order.unit;
                      this.streetNumber = this.order.streetNumber;
                      this.street = this.order.streetName;
                      this.name = this.order.name;
                      this.buyerPhone = this.order.buyerPhone;
                      this.district = this.order.district;
                      this.city = this.order.city;
                      this.province = this.order.province;
                      this.postcode = this.order.zip;
                      this.country = this.order.country;

                      const selectedAddresses = this.addresses.filter(
                        (item: any) => {
                          return item.name == this.name &&
                          item.buyerPhone == this.buyerPhone &&
                          item.suite == this.suite &&
                          item.streetNumber == this.streetNumber &&
                          item.street == this.street &&
                          item.district == this.district &&
                          item.city == this.city &&
                          item.province == this.province &&
                          item.postcode == this.postcode &&
                          item.country == this.country
                        }
                      );

                      if(selectedAddresses && selectedAddresses.length > 0) {
                        this.id = selectedAddresses[0]._id;
                      }
                    }
                  }
                );

              }

            }
          );
        }
      }
    ); 

    // this.userServ.getMe().subscribe(
    //   (res: any) => {
    //     console.log('resme==', res);
    //     if (res && res.ok) {
    //       const member = res._body;
    //       if (member.homeAddressId) {
    //         this.id = member.homeAddressId;
    //         this.addressServ.getAddress(member.homeAddressId).subscribe(
    //           (res: any) => {
    //             console.log('res for addressss=', res);
    //             if (res && res.ok) {
    //               const address = res._body;
    //               this.suite = address.suite;
    //               this.streetNumber = address.streetNumber;
    //               this.street = address.street;
    //               this.district = address.district;
    //               this.city = address.city;
    //               this.province = address.province;
    //               this.postcode = address.postcode;
    //               this.country = address.country;
    //               console.log('res  for address=', res);
    //             }
    //           }
    //         );
    //       }
    //     }
    //   }
    // );

    this.buildForm();    // 初始化时构建表单
  }

  // 构建表单方法
  buildForm(): void {
    // 通过 formBuilder构建表单
    this.workForm = this.fb.group({
      name: ['', [    // 在页面上已有验证
        Validators.required,    // 必填
        Validators.minLength(3),    // 最短为 3
        // Validators.maxLength(20),    // 最长为 10
        // this.validateRex('notdown', /^(?!_)/),    // 不能以下划线开头
        // this.validateRex('only', /^[1-9a-zA-Z_]+$/),    // 只能包含数字、字母、下划线
      ]],
      buyerPhone: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      suite: ['', [    // N/A
      ]],
      streetNumber: ['', [
        Validators.required,
      ]],
      street: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      district: ['', [    // N/A
      ]],
      city: ['', [
        Validators.required,
        Validators.minLength(2),
      ]],
      province: ['', [
        Validators.required,
        Validators.minLength(2),
      ]],
      postcode: ['', [
        Validators.required,
        Validators.minLength(3),
      ]],
      country: ['', [    // N/A
      ]],
    });
  }

  isInvalid( form: any, id: string ) {
    // *ngIf="(workForm.get('name').touched || workForm.get('name').dirty) && workForm.get('name').invalid"
    return (form.get(id).touched || form.get(id).dirty) && form.get(id).invalid;  // .errors 也可
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
      // this.spinner.show();
      this.updateOrderAddressDo(seed);
    });    
    //this.ngxSmartModalServ.getModal('passwordModal').open();

  }

    // 遍历表单，设为“已触摸”
    markFormGroupTouched( formGroup: FormGroup ) {
        (<any>Object).values(formGroup.controls).forEach(item => {
            if (item.controls) {
                this.markFormGroupTouched(item);
            } else {
                item.markAsTouched();
             // item.markAsDirty();
             // item.updateValueAndValidity();
            }
        });
    }

    selectAddress( address: any ) {
        this.id = address._id;
        this.suite = address.suite;
        this.streetNumber = address.streetNumber;
        this.street = address.street;
        this.name = address.name;
        this.buyerPhone = address.buyerPhone;
        this.district = address.district;
        this.city = address.city;
        this.province = address.province;
        this.postcode = address.postcode;
        this.country = address.country;

        // Fix: ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
        setTimeout(() => {  // 1, 异步解决 setTimeout(); 2, 变更检测 detectChanges()
            // Fix: 在更换地址时，马上展示检测
            this.markFormGroupTouched(this.workForm);  // 遍历表单，设为“已触摸”
        });
    }

  async updateOrderAddressDo(seed: Buffer) {
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey;
    const updatedOrder = {
      name: this.name,
      buyerPhone: this.buyerPhone,
      unit: this.suite,
      streetNumber: this.streetNumber,
      streetName: this.street,
      city: this.city,
      district: this.district,
      province: this.province,
      zip: this.postcode,
      country: this.country
    };  

    const sig = this.kanbanServ.signJsonData(privateKey, updatedOrder);
    updatedOrder['sig'] = sig.signature;           
    this.orderServ.update2(this.orderID, updatedOrder).subscribe(
      (res: any) => {
        if (res) {
          this.addAddress(privateKey);  // 继续处理
          // this.spinner.hide();
          
        }
      }
    );

  }

  confirm() {
    this.updateOrderAddress();
  }
  
  addAddress(privateKey: any) {

    const address = {
      name: this.name,
      buyerPhone: this.buyerPhone,
      suite: this.suite,
      streetNumber: this.streetNumber,
      street: this.street,
      district: this.district,
      city: this.city,
      province: this.province,
      postcode: this.postcode,
      country: this.country
    };

    const sig = this.kanbanServ.signJsonData(privateKey, address);
    address['sig'] = sig.signature;  
    console.log('this.id====', this.id);
    if (this.id) {
      this.addressServ.updateAddress(this.id, address).subscribe(
        (res: any) => {
          console.log('res for updateAddress', address);
          if (res) {
            this.router.navigate(['/store/'+ this.storeId + '/payment/' + this.orderID]);
          }
        }
      );
    } else {
      this.addressServ.addAddress(address).subscribe(
        (res: any) => {
          if (res) {
            this.router.navigate(['/store/'+ this.storeId + '/payment/' + this.orderID]);
            /*
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
            */
          }
          console.log('res for addAddress', address);
        }
      );
    }
  }
}