
import { Component, OnInit } from '@angular/core';
import { OrderMerchantComponent as ParentOrderComponent } from 'src/app/modules/store/order/order-m.component';

@Component({
    selector: 'app-order-2',
    templateUrl: './order-2.component.html',
    styleUrls: [
        './order-2.component.scss',
        '../../../../../page.scss'
    ]
})
export class Order2Component extends ParentOrderComponent{}
