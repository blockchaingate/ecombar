// import { NgModule } from '@angular/core';
// import { Routes, RouterModule } from '@angular/router';

// const defaultTheme: Routes = [
//   {
//     path: 'home',
//     loadChildren: () =>
//       import('./modules/theme/default/home.module').then(m => m.HomeModule)
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
//     path: '', redirectTo: '/home', pathMatch: 'full'
//   }
// ];

// const madEarn: Routes = [
//   {
//     path: 'home',
//     loadChildren: () =>
//       import('./modules/theme/mad-earn/mad-earn.module').then(m => m.MadEarnModule)
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
//     path: '', redirectTo: '/home', pathMatch: 'full'
//   }
// ];



// const nft: Routes = [
 
//   {
//     path: 'wallet',
//     loadChildren: () =>
//       import('./modules/wallet/wallet.module').then(m => m.WalletModule)
//   },  
//   {
//     path: 'home',
//     loadChildren: () =>
//       import('./modules/nft/nft.module').then(m => m.NftModule)
//   },
//   {
//     path: '', redirectTo: '/home', pathMatch: 'full'
//   }
// ];

// @NgModule({
//   imports: [RouterModule.forRoot(defaultTheme, {
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
