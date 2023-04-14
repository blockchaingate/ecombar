import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AddressComponent } from './pages/address/address.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { ShipsComponent } from './pages/ships/ships.component';

import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { ShippingComponent } from './pages/shipping/shipping.component';
import { CommentComponent } from './pages/comment/comment.component';
import { FavoriteComponent } from './pages/favorite/favorite.component';
import { MyProductsComponent } from './pages/my-products/my-products.component';
import { MyCommentsComponent } from './pages/my-comments/my-comments.component';

import { 
  AuthGuardService as AuthGuard 
} from 'src/app/modules/shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '', component: AccountComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'address', component: AddressComponent
      },
      {
        path: 'favorite', component: FavoriteComponent
      },      
      {
        path: 'my-products', component: MyProductsComponent
      },                   
      {
        path: 'my-comments', component: MyCommentsComponent
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
        path: 'profile', component: ProfileComponent
      },     
      {
        path: 'comment/:orderId/:productId', component: CommentComponent
      },
      {
        path: 'upload', component: UploadMediaComponent
      },
      {
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full',
  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
