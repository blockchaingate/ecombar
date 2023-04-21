
import { Component, OnInit } from '@angular/core';
import { ShippingCarrierService } from 'src/app/modules/shared/services/shipping-carrier.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-admin-shipping-carrier-add',
    providers: [],
    templateUrl: './shipping-carrier-add.component.html',
    styleUrls: [
        './shipping-carrier-add.component.scss',
        '../../../../../page.scss'
    ]
})
export class ShippingCarrierAddComponent implements OnInit{
    modalRef: BsModalRef;
    wallet: any;  
    sequence: number;
    flatRate: number;
    name: string;
    nameChinese: string;
    nameTradition: string;
    desc: string;
    descChinese: string;
    descTradition: string;
    NavTab: string;    // 导航 Tab
    currentTab: string;    // 语言 Tab
    id: string;
    number: string;
  
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public kanbanServ: KanbanService,
        private dataServ: DataService,
        private modalService: BsModalService,
        private shippingCarrierServ: ShippingCarrierService) {
    }
  
    ngOnInit() {

        this.NavTab = 'General';    // 缺省页面
        this.currentTab = 'default English';    // 缺省页面

        this.dataServ.currentWallet.subscribe(
            (wallet: any) => {
                this.wallet = wallet;
            }
        ); 

        this.id = this.route.snapshot.paramMap.get('id');
        if (this.id) {
            // this.shippingCarrierServ.getShippingCarrier(this.id).subscribe(
            //     (res: any) => {
            //         console.log('ressssss for brand=', res);
            //         if (res && res.ok) {
            //             const shippingCarrier = res._body;
            //             console.log('shippingCarrier=', shippingCarrier);

            //             this.flatRate = shippingCarrier.flatRate;
            //             this.name = shippingCarrier.name[0].text;
            //             this.nameChinese = shippingCarrier.name[1].text;

            //             this.desc = shippingCarrier.desc[0].text;
            //             this.descChinese = shippingCarrier.desc[1].text;

            //             this.sequence = shippingCarrier.sequence;
            //         }
            //     }
            // );
            this.shippingCarrierServ.getTableInfo(this.id).subscribe(
                (res: any) => {
                    if (res && res.status == 200 && res.data) {
                        const table = res.data;
                        console.log('tableyyy=', table);
                        this.name = table.nameSet.en;
                        this.nameChinese = table.nameSet.sc;
                        this.nameTradition = table.nameSet.tc;
                        this.number = String(table.number);
                    }
                }
            );
        }
    }
  
    changeNavTab(tabName: string) {
        this.NavTab = tabName;
    }
  
    changeTab(tabName: string) {
        this.currentTab = tabName;
    }
  
    addShippingCarrier() {
        let data: any = {
            number: parseInt(this.number),
            name: this.name,
            nameSc: this.nameChinese,
            nameTc: this.nameTradition,
        };

        if (this.id) {
            console.log('data=', data);
 
            this.shippingCarrierServ.updateTable(data).subscribe(
                (res: any) => {
                    console.log('res=', res);
                    if (res && res.status == 200 && res.data) {
                        this.router.navigate(['/merchant/shipping-carriers']);
                    }
                }
            );
        } else {
            console.log('data=', data);

            this.shippingCarrierServ.createTable(data).subscribe(
                (res: any) => {
                    console.log('res=', res);
                    if (res && res.status == 200 && res.data) {
                        this.router.navigate(['/merchant/shipping-carriers']);
                    }
                }
            );
        }

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
        //     this.addBrandDo(privateKey);
        // });
    }
  
    // addBrandDo(privateKey: any) {
    //     const name = [
    //         {
    //         lan: 'en',
    //         text: this.name
    //         },
    //         {
    //         lan: 'sc',
    //         text: this.nameChinese
    //         }
    //     ]; 
    //     const desc = [
    //         {
    //         lan: 'en',
    //         text: this.desc
    //         },
    //         {
    //         lan: 'sc',
    //         text: this.descChinese
    //         }
    //     ];   
    //     const data = {
    //         name: name,
    //         desc: desc,
    //         flatRate: this.flatRate,
    //         sequence: this.sequence ? this.sequence : 0
    //     };
      
    //     const sig = this.kanbanServ.signJsonData(privateKey, data);
    //     data['sig'] = sig.signature;   
    //     if (!this.id) {
    
    //         this.shippingCarrierServ.create(data).subscribe(
    //             (res: any) => {
    //                 if (res && res.ok) {
    //                 this.router.navigate(['/merchant/shipping-carriers']);
    //                 }
    //             }
    //         );
    //     } else {
    //         this.shippingCarrierServ.update(this.id, data).subscribe(
    //             (res: any) => {
    //                 if (res && res.ok) {
    //                 this.router.navigate(['/merchant/shipping-carriers']);
    //                 }
    //             }
    //         );
    //     }
    // }

}
