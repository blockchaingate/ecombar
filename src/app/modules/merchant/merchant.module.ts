import { NgModule } from '@angular/core';
import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { ProductsComponent } from './pages/products/products.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { MyCommentsComponent } from './pages/my-comments/my-comments.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryAddComponent } from './pages/category-add/category-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipsComponent } from './pages/ships/ships.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { AddressComponent } from './pages/address/address.component';
import { CartComponent } from './pages/cart/cart.component';

import { MerchantApplicationsComponent } from './pages/merchant-applications/merchant-applications.component';
import { CommentComponent } from './pages/comment/comment.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { MainLayoutAddComponent } from './pages/main-layout-add/main-layout-add.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { StoreComponent } from './pages/store/store.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CartModule } from '../theme/default/cart/cart.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { QRCodeModule } from 'angularx-qrcode';
import { RoleMenuPipe } from './pipes/role-menu.pipe';

@NgModule({
  declarations: [
    MerchantComponent,

    MyCommentsComponent,
    FavoriteComponent,

    UploadMediaComponent,
    DashboardComponent,
    UsersComponent,
    ShipsComponent,
    StoreComponent,
    CommentComponent,
    CartComponent,
    MainLayoutAddComponent,
    MainLayoutComponent,
    MerchantApplicationsComponent,
    
    MyProductsComponent,
    BannersComponent,
    OrdersComponent,
    ProfileComponent,
    BannerAddComponent,
    CollectionAddComponent,
    UserAddComponent,
    AddressComponent,
    
    ShippingComponent,
    MerchantsComponent,
    ProductsComponent,
    MerchantInfoComponent,
    CollectionsComponent,
    CategoriesComponent,
    ProductAddComponent,
    CategoryAddComponent,
    BrandsComponent,
    BrandAddComponent,
    RoleMenuPipe
  ],
  imports: [
    MerchantRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    CartModule,
    QRCodeModule,
    ModalModule.forRoot(),
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    RichTextEditorModule
  ],
  providers: []
})
export class MerchantModule { }
