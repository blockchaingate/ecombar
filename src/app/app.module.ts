import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { userReducer } from './store/reducers/user.reducer';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { DataService } from 'src/app/modules/shared/services/data.service';
//import { UserState } from './reducers/user.state';
import { reducers } from './store/reducers';
import { Router, Routes } from '@angular/router';
import { ThemeService } from './services/theme.service';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['user'], rehydrate: true })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];



const defaultTheme: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/modules/theme/default/home.module').then(m => m.HomeModule)
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
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }
];

const madEarn: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('src/app/modules/theme/mad-earn/mad-earn.module').then(m => m.MadEarnModule)
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
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }
];



const nft: Routes = [
  {
    path: 'wallet',
    loadChildren: () =>
      import('./modules/wallet/wallet.module').then(m => m.WalletModule)
  },  
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/nft/nft.module').then(m => m.NftModule)
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  }

];




@NgModule({
  declarations: [
    AppComponent,
    // MenuMobileComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    HttpClientModule,
    TranslateModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
  currentTheme!: String;

  constructor(
    private theme: ThemeService,
    private router: Router) {
    // this.router.resetConfig(defulatThenme);
    // this.router.navigateByUrl('/home');

    this.theme.currentMessage.subscribe(message => {
      this.currentTheme = message;

      console.log("this.message: " + this.currentTheme);
      switch (this.currentTheme) {
        case 'Default':
          this.router.resetConfig(defaultTheme);
          break;
        case 'MadEarn':
          this.router.resetConfig(madEarn);
          break;
        case 'NFT':
          this.router.resetConfig(nft);
          break;
        default:
          this.router.resetConfig(defaultTheme);

      }
      this.router.navigateByUrl('/home');

    });

  }

}
