
import { Component, OnInit } from '@angular/core';
import { ShippingCarrierService } from 'src/app/modules/shared/services/shipping-carrier.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Router } from '@angular/router';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
    selector: 'app-admin-shipping-carriers',
    providers: [],
    templateUrl: './shipping-carriers.component.html',
    styleUrls: [
        './shipping-carriers.component.scss',
        '../../../../../page.scss'
    ]
})

export class ShippingCarriersComponent implements OnInit{
    shippingCarriers: any;
    wallet: any;
    walletAddress: string;
    store: any;
    storeId: string;
    merchantId: string;
    currency: string;
    modalRef: BsModalRef;
    errMsg = '';

    constructor(
        public kanbanServ: KanbanService,
        private modalService: BsModalService,
        private dataServ: DataService,
        private orderServ: OrderService,
        private coinServ: CoinService,
        private toastr: ToastrService,
        // private spinner: NgxSpinnerService,
        private router: Router,
        private shippingCarrierServ: ShippingCarrierService) {
    }

    ngOnInit() {
        this.dataServ.currentWallet.subscribe(
            (wallet: any) => {
                this.wallet = wallet;
            }
        ); 

        this.updateData();  // 更新数据（即时刷新）
        
        this.dataServ.currentMyStore.subscribe(
            (store: any) => {
                if(store) {
                    this.currency = store.coin;
                    this.store = store;
                    this.storeId = store._id;  // 返回“商家页” products-grid
                    this.merchantId = store.id;  // 小心名字看错
                    console.log('store===', store);
                }
            }
        );

    }

    // 更新数据（即时刷新）
    updateData() {

        this.shippingCarriers = [];
        // this.dataServ.currentWalletAddress.subscribe(
        //     (walletAddress: string) => {
        //         if(walletAddress) {
        //             this.getMerchantShippingCarriers(walletAddress);
        //         }
        //     }
        // );
        this.shippingCarrierServ.getTableList().subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    console.log("Tables=", res.data);
                    this.shippingCarriers = res.data;
                }
            }
        );

    }

    // getMerchantShippingCarriers(walletAddress: string) {
    //     this.shippingCarrierServ.getMerchantShippingCarriers(walletAddress).subscribe(
    //         (res: any) => {
    //             if (res && res.ok) {
    //                 this.shippingCarriers = res._body;
    //             }
    //         }
    //     );
    // }
  
    editShippingCarrier( shippingCarrier_id: string ) {
        this.router.navigate(['/merchant/shipping-carrier/' + shippingCarrier_id + '/edit']);
    }
  
    deleteShippingCarrier( tableId ) {

        this.shippingCarrierServ.deleteTable(tableId).subscribe(
            (res: any) => {
                if (res && res.status == 200 && res.data) {
                    // location.reload();
                    this.updateData();  // 更新数据（即时刷新）
                }
            }
        );
        
        // const initialState = {
        //     pwdHash: this.wallet.pwdHash,
        //     encryptedSeed: this.wallet.encryptedSeed
        // };          

        // if(!this.wallet || !this.wallet.pwdHash) {
        //     this.router.navigate(['/wallet']);
        //     return;
        // }

        // this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
    
        // this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        //     this.deleteShippingCarrierDo(privateKey, shippingCarrier_id);
        // });
    }
  
    // deleteShippingCarrierDo(privateKey: any, shippingCarrier_id: string) {
    //     const data = {
    //         id: shippingCarrier_id
    //     };
    //     const sig = this.kanbanServ.signJsonData(privateKey, data);
    //     data['sig'] = sig.signature;        
    //     this.shippingCarrierServ.deleteShippingCarrier(data).subscribe(
    //         (res: any) => {
    //             if (res && res.ok) {
    //                 this.shippingCarriers = this.shippingCarriers.filter((item) => item._id != shippingCarrier_id);
    //             }
    //         }
    //     );
    // }

    // 创建新的订单
    newOrder( tableNo: any ) {
        if (parseInt(tableNo) <= 0) {  // 台号 no  // OrderList 的主人
            return;
        }
        if (!this.wallet || !this.wallet.pwdHash) {
            this.router.navigate(['/wallet']);
            return;
        }

        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
        };        
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

        this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
            // this.spinner.show();
            this.newOrderDo(seed, tableNo);
        });
    }

    async newOrderDo( seed: Buffer, tableNo: number ) {
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;

        const uuid = uuidv4();  // '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
        let uuid2 = uuid.replace(/-/g, '');  // 去掉 - 字符
        uuid2 = `${uuid2}(${tableNo})`;  // 加入台号

        const orderData = { 
            merchantId: this.merchantId, 
            owner: this.walletAddress, 
            currency: this.currency, 
            items: [], 
            memo: 'NewOrder',
            externalOrderNumber: uuid2 };
        console.log('orderData=', orderData);
        // owner: { type: String},
        // totalAmount: {type: Number},
        // totalTax: {type: Number},
        // totalShipping: {type: Number},
        // currency: {type: String, required: true},
        // merchantId: {type: String, required: true},
        // items: [{
        //     title: String,
        //     taxRate: Number,
        //     lockedDays: Number,
        //     rebateRate: Number,
        //     price: Number,
        //     quantity: Number
        // }], 
        const sig = this.kanbanServ.signJsonData(privateKey, orderData);
        orderData['sig'] = sig.signature;  
        this.orderServ.create2(orderData).subscribe(
            (res: any) => {
                if (res) {
                    const body = res;
                    const orderNewID = body._id;
                    // this.spinner.hide();

                    location.reload();  // 重新加载当前页面
                }
            },
            err => { 
                this.errMsg = err.message;
                // this.spinner.hide();
                this.toastr.error('error while creating order');              
            }
        );  

    }

  }
