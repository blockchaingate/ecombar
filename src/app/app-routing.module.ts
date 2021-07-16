import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./modules/stores/stores.module').then(m => m.StoresModule)
  },  
  {
    path: 'store',
    loadChildren: () =>
      import('./modules/store/store.module').then(m => m.StoreModule)
  },    
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'merchant',
    loadChildren: () =>
      import('./modules/merchant/merchant.module').then(m => m.MerchantModule)
  },  
  {
    path: 'account',
    loadChildren: () =>
      import('./modules/account/account.module').then(m => m.AccountModule)
  },   
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },  
  {
    path: 'wallet',
    loadChildren: () =>
      import('./modules/wallet/wallet.module').then(m => m.WalletModule)
  },  
  {
    path: 'nft',
    loadChildren: () =>
      import('./modules/nft/nft.module').then(m => m.NftModule)
  },
  {
    path: 'nft',
    redirectTo: '/nft',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
