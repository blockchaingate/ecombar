
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SharedModule } from 'src/app/modules/shared/shared.module';

import { ChefComponent } from './chef.component';
import { FoodListComponent } from './pages/food-list/food-list.component';
import { Order2Component } from './pages/order-2/order-2.component';
import { QRCodeModule } from 'angularx-qrcode';

import { ChefRoutingModule } from './chef-routing.module';

@NgModule({
    declarations: [
        ChefComponent,
        FoodListComponent,
        Order2Component,
    ],
    imports: [
        IonicModule,  // Ionic
        ChefRoutingModule,
        CommonModule,
        SharedModule,
        QRCodeModule,
        ModalModule.forRoot(),
    ],
    providers: [
    ]
})
export class ChefModule { }
