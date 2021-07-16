import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CategoryAddComponent } from './pages/category-add/category-add.component';
import { CollectionsComponent } from './pages/collections/collections.component';
import { AddressComponent } from './pages/address/address.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipsComponent } from './pages/ships/ships.component';

import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { CommentComponent } from './pages/comment/comment.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { MyCommentsComponent } from './pages/my-comments/my-comments.component';
import { MerchantApplicationsComponent } from './pages/merchant-applications/merchant-applications.component';
import { MainLayoutAddComponent } from './pages/main-layout-add/main-layout-add.component';

import { 
  AuthGuardService as AuthGuard 
} from '../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: AccountComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'users', component: UsersComponent
      },
      {
        path: 'address', component: AddressComponent
      },
      {
        path: 'favorite', component: FavoriteComponent
      },      
      {
        path: 'products', component: ProductsComponent
      },
      {
        path: 'my-products', component: MyProductsComponent
      },  
      {
        path: 'main-layout', component: MainLayoutComponent
      },    
      {
        path: 'main-layout/add', component: MainLayoutAddComponent
      },   
      {
        path: 'main-layout/:id/edit', component: MainLayoutAddComponent
      },                 
      {
        path: 'my-comments', component: MyCommentsComponent
      },  
      {
        path: 'merchant-applications', component: MerchantApplicationsComponent
      },      
      {
        path: 'orders', component: OrdersComponent
      }, 
      {
        path: 'shipping/:orderID', component: ShippingComponent
      },   
      {
        path: 'ships', component: ShipsComponent
      },                    
      {
        path: 'product/add', component: ProductAddComponent
      },
      {
        path: 'merchant-info', component: MerchantInfoComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },     
      {
        path: 'comment/:productId', component: CommentComponent
      },      
      {
        path: 'product/:id/edit', component: ProductAddComponent
      },
      {
        path: 'categories', component: CategoriesComponent
      },
      {
        path: 'category/add', component: CategoryAddComponent
      },
      {
        path: 'category/:id/edit', component: CategoryAddComponent
      },
      {
        path: 'brands', component: BrandsComponent
      },
      {
        path: 'brand/add', component: BrandAddComponent
      },
      {
        path: 'brand/:id/edit', component: BrandAddComponent
      },      
      {
        path: 'banners', component: BannersComponent
      },
      {
        path: 'banner/add', component: BannerAddComponent
      },
      {
        path: 'banner/:id/edit', component: BannerAddComponent
      },
      {
        path: 'collections', component: CollectionsComponent
      },
      {
        path: 'collection/add', component: CollectionAddComponent
      },
      {
        path: 'collection/:id/edit', component: CollectionAddComponent
      },
      {
        path: 'user/:id/edit', component: UserAddComponent
      },
      {
        path: 'merchants', component: MerchantsComponent
      },
      {
        path: 'upload', component: UploadMediaComponent
      },
      {
        path: '', redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
