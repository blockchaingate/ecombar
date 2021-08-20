// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () =>
//     import('./modules/stores/stores.module').then(m => m.StoresModule)
//   },
//   {
//     path: 'stores',
//     loadChildren: () =>
//       import('./modules/stores/stores.module').then(m => m.StoresModule)
//   },  
//   {
//     path: 'team',
//     loadChildren: () =>
//       import('./modules/team/team.module').then(m => m.TeamModule)
//   },  
//   {
//     path: 'store/:storeId',
//     loadChildren: () =>
//       import('./modules/store/store.module').then(m => m.StoreModule)
//   },   
//   {
//     path: 'iddock',
//     loadChildren: () =>
//       import('./modules/iddock/iddock.module').then(m => m.IddockModule)
//   },   
//   {
//     path: 'admin',
//     loadChildren: () =>
//       import('./modules/admin/admin.module').then(m => m.AdminModule)
//   },
//   {
//     path: 'merchant',
//     loadChildren: () =>
//       import('./modules/merchant/merchant.module').then(m => m.MerchantModule)
//   },  
//   {
//     path: 'account',
//     loadChildren: () =>
//       import('./modules/account/account.module').then(m => m.AccountModule)
//   },   
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('./modules/auth/auth.module').then(m => m.AuthModule)
//   },  
//   {
//     path: 'wallet',
//     loadChildren: () =>
//       import('./modules/wallet/wallet.module').then(m => m.WalletModule)
//   },  
//   {
//     path: 'nft',
//     loadChildren: () =>
//       import('./modules/nft/nft.module').then(m => m.NftModule)
//   },
//   {
//     path: 'nft',
//     redirectTo: '/nft',
//     pathMatch: 'full'
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(routes, {
//     initialNavigation: 'enabled'
// })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
