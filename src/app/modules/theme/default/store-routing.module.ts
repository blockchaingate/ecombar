import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreComponent } from './store.component';
//import { Product2Component } from './product2/product2.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { Category2Component } from './category/category2.component';
import { SearchComponent } from './search/search.component';
import { OrderComponent } from './order/order.component';
import { ApplyForMerchantComponent } from './apply-for-merchant/apply-for-merchant.component';
import { CompareComponent } from './compare/compare.component';
import { TrackOrderComponent } from './track-order/track-order.component';
import { OrderListComponent } from './order-list/order-list.component';
import { StoreLocatorComponent } from './store-locator/store-locator.component';
import { CustomerServiceComponent } from './customer-service/customer-service.component';
import { ReturnsComponent } from './returns/returns.component';
import { FaqComponent } from './faq/faq.component';
import { ProductsGridComponent } from 'src/app/modules/shared/components/products-grid/products-grid.component';

const routes: Routes = [
  {
    path: '',
    component: StoreComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('../../auth/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'product',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule)
      },
      {
        path: 'community',
        loadChildren: () => import('./community/community.module').then(m => m.CommunityModule)
      },
      {
        path: 'category/:id',
        component: Category2Component
      },  
      {
        path: 'order2',  // 取消 'order/:id'  // 原值 'order'，为防止二义，改
        component: OrderComponent
      },         
      {
        path: 'apply-for-merchant',
        component: ApplyForMerchantComponent
      },
      {
        path: 'track-order',
        component: TrackOrderComponent
      },
      {
        path: 'track-order/:id',
        component: TrackOrderComponent
      },
      {
        path: 'order-list',
        component: OrderListComponent
      },
      {
        path: 'order-list/:id',
        component: OrderListComponent
      },
      {
        path: 'store-locator',
        component: StoreLocatorComponent
      },
      /*
      {
        path: 'product2',
        component: Product2Component
      },
      */
      {
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'compare',
        component: CompareComponent
      },
      {
        path: 'search',
        component: SearchComponent
      },   
      {
        path: 'customer-service',
        component: CustomerServiceComponent
      },     
      {
        path: 'returns',
        component: ReturnsComponent
      },  
      {
        path: 'faq',
        component: FaqComponent
      },       
      {
        path: 'payment',
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule)
      },
      {
        path: 'place-order',
        loadChildren: () => import('./place-order/place-order.module').then(m => m.PlaceOrderModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
      },
      {
        path:'wishlist',
        component: WishlistComponent
        // loadChildren: () => import('./wishlist/wishlist.module').then(m => m.WishlistModule)
      },
      {
        path: 'address',
        loadChildren: () => import('./address/address.module').then(m => m.AddressModule)
      },
      {
        path: 'activate',
        loadChildren: () => import('./activate/activate.module').then(m => m.ActivateModule)
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }


