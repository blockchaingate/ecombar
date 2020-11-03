import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { NavComponent } from './layout/nav/nav.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { ProductsComponent } from './pages/products/products.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryAddComponent } from './pages/category-add/category-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { AddressComponent } from './pages/address/address.component';
import { CartComponent } from './pages/cart/cart.component';
import { CommentComponent } from './pages/comment/comment.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { CartModule } from '../home/cart/cart.module';
@NgModule({
  declarations: [
    AdminComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent,
    FavoriteComponent,
    UploadMediaComponent,
    DashboardComponent,
    UsersComponent,
    CommentComponent,
    CartComponent,
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
    BrandAddComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    CartModule,
    RichTextEditorModule
  ],
  providers: []
})
export class AdminModule { }
