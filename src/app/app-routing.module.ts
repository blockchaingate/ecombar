import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
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
    path: '',
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
