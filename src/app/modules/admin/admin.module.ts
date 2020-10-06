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
import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryAddComponent } from './pages/category-add/category-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AdminComponent,
    FooterComponent,
    HeaderComponent,
    NavComponent,
    UploadMediaComponent,
    DashboardComponent,
    UsersComponent,
    BannersComponent,
    BannerAddComponent,
    CollectionAddComponent,
    UserAddComponent,
    MerchantsComponent,
    ProductsComponent,
    CollectionsComponent,
    CategoriesComponent,
    ProductAddComponent,
    CategoryAddComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule
  ],
  providers: []
})
export class AdminModule { }
