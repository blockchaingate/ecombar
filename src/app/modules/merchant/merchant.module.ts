import { NgModule } from '@angular/core';
import { MerchantRoutingModule } from './merchant-routing.module';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MerchantComponent } from './merchant.component';
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
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { SmallBannersComponent } from './pages/small-banners/small-banners.component';
import { SmallBannerAddComponent } from './pages/small-banner-add/small-banner-add.component';
import { TopCategoryBannersComponent } from './pages/top-category-banners/top-category-banners.component';
import { TopCategoryBannerAddComponent } from './pages/top-category-banner-add/top-category-banner-add.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipsComponent } from './pages/ships/ships.component';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { AddressComponent } from './pages/address/address.component';

import { MerchantApplicationsComponent } from './pages/merchant-applications/merchant-applications.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { MainLayoutAddComponent } from './pages/main-layout-add/main-layout-add.component';
import { StoreComponent } from './pages/store/store.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { RoleMenuPipe } from './pipes/role-menu.pipe';
import { FeaturesComponent } from './pages/features/features.component';
import { FeatureAddComponent } from './pages/feature-add/feature-add.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { ReturnsPolicyComponent } from './pages/returns-policy/returns-policy.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BlogAddComponent } from './pages/blog-add/blog-add.component';

import { ShippingCarriersComponent } from './pages/shipping-carriers/shipping-carriers.component';
import { ShippingCarrierAddComponent } from './pages/shipping-carrier-add/shipping-carrier-add.component';
@NgModule({
  declarations: [
    MerchantComponent,
    UploadMediaComponent,
    DashboardComponent,
    UsersComponent,
    ShipsComponent,
    StoreComponent,
    MainLayoutAddComponent,
    MainLayoutComponent,
    MerchantApplicationsComponent,
    BannersComponent,
    OrdersComponent,
    ProfileComponent,
    BannerAddComponent,
    CollectionAddComponent,
    UserAddComponent,
    AddressComponent,
    SmallBannersComponent,
    SmallBannerAddComponent,
    TopCategoryBannersComponent,
    TopCategoryBannerAddComponent,
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
    RoleMenuPipe,
    FeaturesComponent,
    NewslettersComponent,
    FeatureAddComponent,
    CustomerServiceComponent,
    ReturnsPolicyComponent,
    FaqComponent,
    BlogAddComponent,
    ShippingCarriersComponent,
    ShippingCarrierAddComponent
  ],
  imports: [
    BsDropdownModule.forRoot(),
    MerchantRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    QRCodeModule,
    ModalModule.forRoot(),
    NgxSpinnerModule,
    ReactiveFormsModule,
    RichTextEditorModule,
    CollapseModule.forRoot()
  ],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})
export class MerchantModule { }
