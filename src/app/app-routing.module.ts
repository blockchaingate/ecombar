import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { themeEvn } from 'src/environments/themeEnv';
import { ThemeService } from './services/theme.service';

const defaultTheme: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/stores/stores.module').then(m => m.StoresModule)
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./modules/stores/stores.module').then(m => m.StoresModule)
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./modules/team/team.module').then(m => m.TeamModule)
  },
  {
    path: 'store/:storeId',
    loadChildren: () =>
      import('./modules/theme/default/store.module').then(m => m.StoreModule)
  },
  {
    path: 'newstore/:storeId',
    loadChildren: () =>
      import('./modules/newstore/newstore.module').then(m => m.NewstoreModule)
  },
  {
    path: 'iddock',
    loadChildren: () =>
      import('./modules/iddock/iddock.module').then(m => m.IddockModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('src/app/modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'merchant',
    loadChildren: () =>
      import('src/app/modules/merchant/merchant.module').then(m => m.MerchantModule)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('src/app/modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'wallet',
    loadChildren: () =>
      import('src/app/modules/wallet/wallet.module').then(m => m.WalletModule)
  },
  {
    path: 'nft',
    loadChildren: () =>
      import('src/app/modules/nft/nft.module').then(m => m.NftModule)
  },
];

const madEarn: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/stores/stores.module').then(m => m.StoresModule)
  },
  {
    path: 'stores',
    loadChildren: () =>
      import('./modules/stores/stores.module').then(m => m.StoresModule)
  },
  {
    path: 'team',
    loadChildren: () =>
      import('./modules/team/team.module').then(m => m.TeamModule)
  },
  {
    path: 'store/:storeId',
    loadChildren: () =>
      import('./modules/theme/mad-earn/madearn.module').then(m => m.MadearnModule)
  },
  {
    path: 'iddock',
    loadChildren: () =>
      import('./modules/iddock/iddock.module').then(m => m.IddockModule)
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('src/app/modules/admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'merchant',
    loadChildren: () =>
      import('src/app/modules/merchant/merchant.module').then(m => m.MerchantModule)
  },
  {
    path: 'account',
    loadChildren: () =>
      import('src/app/modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'wallet',
    loadChildren: () =>
      import('src/app/modules/wallet/wallet.module').then(m => m.WalletModule)
  },
  {
    path: 'nft',
    loadChildren: () =>
      import('src/app/modules/nft/nft.module').then(m => m.NftModule)
  },
];

let routes: Routes = [];

switch (themeEvn.defaultTheme) {
  case 'Default':
    routes = defaultTheme;
    break;
  case 'MadEarn':
    routes = madEarn;
    break;
  // case 'NFT':
  //   this.router.resetConfig(nft);
  //   break;
  default:
    routes = defaultTheme;

}

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  currentTheme!: String;

  constructor(
    private theme: ThemeService,
    private router: Router) {
    // this.router.resetConfig(defulatThenme);
    // this.router.navigateByUrl('/home');

  this.theme.currentMessage.subscribe(message => {
    if(this.currentTheme == null || this.currentTheme==""){
      this.currentTheme = message;
      console.log("this.message: " + this.currentTheme);
    }else{
      this.currentTheme = message;
      console.log("this.message: " + this.currentTheme);
      switch (this.currentTheme) {
        case 'Default':
          this.router.resetConfig(defaultTheme);
          break;
        case 'MadEarn':
          this.router.resetConfig(madEarn);
          break;
        // case 'NFT':
        //   this.router.resetConfig(nft);
        //   break;
        default:
          this.router.resetConfig(defaultTheme);
  
      }
      this.router.navigateByUrl('');
    }

  });
  
}}

// @NgModule({
//   declarations: [],
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule],
//   providers: []
// })
// export class AppRoutingModule {}




// @NgModule({
//   imports: [RouterModule.forRoot(routes, {
//     initialNavigation: 'enabled'
// })],
//   exports: [RouterModule]
// })
// export class AppRoutingModule { }


// import { RouterModule, Routes } from '@angular/router';
// import { NgModule } from '@angular/core';

// const routes: Routes = [];
