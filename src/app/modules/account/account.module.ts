import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MyCommentsComponent } from './pages/my-comments/my-comments.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipsComponent } from './pages/ships/ships.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { AddressComponent } from './pages/address/address.component';

import { CommentComponent } from './pages/comment/comment.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { RoleMenuPipe } from './pipes/role-menu.pipe';
import { NgxSpinnerModule } from "ngx-spinner";

@NgModule({
  declarations: [
    AccountComponent,

    MyCommentsComponent,
    FavoriteComponent,

    UploadMediaComponent,
    DashboardComponent,
    ShipsComponent,
    
    CommentComponent,
    
    MyProductsComponent,
    OrdersComponent,
    ProfileComponent,
    AddressComponent,
    
    ShippingComponent,
    RoleMenuPipe
  ],
  imports: [
    AccountRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    QRCodeModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    RichTextEditorModule,
    NgxSpinnerModule
  ],
  exports: [OrdersComponent],
  providers: []
})
export class AccountModule { }
