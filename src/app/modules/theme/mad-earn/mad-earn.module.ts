import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home-routing.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home.component';
import { HeaderComponent } from './layout/header/header.component';
import { MenuMobileComponent } from './layout/header/menu-mobile/menu-mobile.component';
import { FooterComponent } from './layout/footer/footer.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { Category2Component } from './category2/category2.component';
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
import { SubCategoriesComponent } from './layout/header/sub-categories/sub-categories.component';
// import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
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
    SubCategoriesComponent
  ],
  imports: [
    // QRCodeModule,
    HomeRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  providers: []
})
export class MadEarnModule { }
