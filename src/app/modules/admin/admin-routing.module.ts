import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
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
import { WalletPwdComponent } from './pages/my-assets/components/create-wallet/wallet-pwd.component';
import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { ConfirmMnemonicsComponent } from './pages/my-assets/components/create-wallet/confirmmnem.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { CommentComponent } from './pages/comment/comment.component';
import { CartComponent } from './pages/cart/cart.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { MyCommentsComponent } from './pages/my-comments/my-comments.component';
import { MyAssetsComponent } from './pages/my-assets/my-assets.component';
import { CreateWalletComponent } from './pages/my-assets/components/create-wallet/create-wallet.component';
import { ImportWalletComponent } from './pages/my-assets/components/import-wallet/import-wallet.component';
import { WalletDashboardComponent } from './pages/my-assets/components/wallet-dashboard/wallet-dashboard.component';

import { 
  AuthGuardService as AuthGuard 
} from '../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    canActivate: [AuthGuard], 
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
        path: 'my-comments', component: MyCommentsComponent
      },  
      {
        path: 'my-assets', component: MyAssetsComponent
      }, 
      {
        path: 'wallet-dashboard', component: WalletDashboardComponent
      },
      {
        path: 'wallet-pwd', component: WalletPwdComponent
      },
      {
        path: 'confirm-mnemonics', component: ConfirmMnemonicsComponent
      }, 
      {
        path: 'create-wallet', component: CreateWalletComponent
      },  
      {
        path: 'wallet-pwd', component: WalletPwdComponent
      },       
      {
        path: 'confirm-words', component: ConfirmMnemonicsComponent
      },        
      {
        path: 'import-wallet', component: ImportWalletComponent
      },  
      {
        path: 'orders', component: OrdersComponent
      }, 
      {
        path: 'shipping/:orderID', component: ShippingComponent
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
        path: 'cart', component: CartComponent
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
export class AdminRoutingModule { }
