import { NgModule } from '@angular/core';
import { StoreRoutingModule } from './store-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { ModalModule } from 'ngx-bootstrap/modal';
import { StoreComponent } from './store.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuMobileComponent } from './layout/header/menu-mobile/menu-mobile.component';
import { FooterComponent } from './layout/footer/footer.component';
// import { MenuComponent } from './menu/menu.component';    // 暂时弃用 MenuComponent
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { Category2Component } from './category/category2.component';
import { SearchComponent } from './search/search.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductListWholeComponent } from './components/product-list-whole/product-list-whole.component';
import { ApplyForMerchantComponent } from './apply-for-merchant/apply-for-merchant.component';
import { ProductItemOneComponent } from './components/product-item-one/product-item-one.component';
import { ProductItemTwoComponent } from './components/product-item-two/product-item-two.component';
import { ProductItemThreeComponent } from './components/product-item-three/product-item-three.component';
import { ProductItemFourComponent } from './components/product-item-four/product-item-four.component';
import { CompareComponent } from './compare/compare.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderComponent } from './order/order.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { StoreLocatorComponent } from './store-locator/store-locator.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { ReturnsComponent } from './returns/returns.component';
import { FaqComponent } from './faq/faq.component';
import { BlogComponent } from './blog/blog.component';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    StoreComponent,
    HeaderComponent,
    FooterComponent,
    // MenuComponent,    // 暂时弃用 MenuComponent
    Category2Component,
    ProductListComponent,
    MenuMobileComponent,
    ApplyForMerchantComponent,
    ProductItemOneComponent,
    ProductItemTwoComponent,
    ProductItemThreeComponent,
    ProductItemFourComponent,
    CompareComponent,
    SearchComponent,
    OrderComponent,
    ProductListWholeComponent,
    WishlistComponent,
    TrackOrderComponent,
    OrderListComponent,
    StoreLocatorComponent,
    CustomerServiceComponent,
    ReturnsComponent,
    FaqComponent,
    BlogComponent
  ],
  imports: [
    // QRCodeModule,
    StoreRoutingModule,
    CommonModule,
    FormsModule,
    NgxSpinnerModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    SharedModule
  ],
  providers: []
})
export class StoreModule { }
