
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MerchantComponent } from './merchant.component';
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
import { OrderComponent } from './pages/order/order.component';
import { ShipsComponent } from './pages/ships/ships.component';
import { NewslettersComponent } from './pages/newsletters/newsletters.component';
import { TopCategoryBannersComponent } from './pages/top-category-banners/top-category-banners.component';
import { TopCategoryBannerAddComponent } from './pages/top-category-banner-add/top-category-banner-add.component';
import { CollectionAddComponent } from './pages/collection-add/collection-add.component';
import { UserAddComponent } from './pages/user-add/user-add.component';
import { BannersComponent } from './pages/banners/banners.component';
import { BrandsComponent } from './pages/brands/brands.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';
import { BrandAddComponent } from './pages/brand-add/brand-add.component';
import { BannerAddComponent } from './pages/banner-add/banner-add.component';
import { SmallBannersComponent } from './pages/small-banners/small-banners.component';
import { SmallBannerAddComponent } from './pages/small-banner-add/small-banner-add.component';
import { MerchantInfoComponent } from './pages/merchant-info/merchant-info.component';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { MerchantApplicationsComponent } from './pages/merchant-applications/merchant-applications.component';
import { MainLayoutAddComponent } from './pages/main-layout-add/main-layout-add.component';
import { StoreComponent } from './pages/store/store.component';
import { FeaturesComponent } from './pages/features/features.component';
import { FeatureAddComponent } from './pages/feature-add/feature-add.component';

import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { ReturnsPolicyComponent } from './pages/returns-policy/returns-policy.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ShippingCarriersComponent } from './pages/shipping-carriers/shipping-carriers.component';
import { ShippingCarrierAddComponent } from './pages/shipping-carrier-add/shipping-carrier-add.component';

const routes: Routes = [
{
    path: '', component: MerchantComponent,
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
            path: 'products', component: ProductsComponent
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
            path: 'merchant-applications', component: MerchantApplicationsComponent
        },      
        {
            path: 'orders', component: OrdersComponent
        }, 
        {
            path: 'order/:id', component: OrderComponent
        }, 
        {
            path: 'newsletters', component: NewslettersComponent
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
            path: 'store', component: StoreComponent
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
            path: 'small-banners', component: SmallBannersComponent
        },
        {
            path: 'small-banner/add', component: SmallBannerAddComponent
        },
        {
            path: 'top-category-banners', component: TopCategoryBannersComponent
        },
        {
            path: 'top-category-banner/add', component: TopCategoryBannerAddComponent
        },
        {
            path: 'small-banner/:id/edit', component: SmallBannerAddComponent
        },
        {
            path: 'features', component: FeaturesComponent
        },
        {
            path: 'feature/add', component: FeatureAddComponent
        },
        {
            path: 'feature/:id/edit', component: FeatureAddComponent
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
            path: 'customer-service', component: CustomerServiceComponent
        },
        {
            path: 'returns-policy', component: ReturnsPolicyComponent
        },
        {
            path: 'faq', component: FaqComponent
        },    
        {
            path: 'shipping-carriers', component: ShippingCarriersComponent
        },
        {
            path: 'shipping-carrier/add', component: ShippingCarrierAddComponent
        },
        {
            path: 'shipping-carrier/:id/edit', component: ShippingCarrierAddComponent
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
export class MerchantRoutingModule { }
