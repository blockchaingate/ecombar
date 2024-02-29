import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StorageModule } from '@ngx-pwa/local-storage';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader/dist';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { userReducer } from './store/reducers/user.reducer';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { DataService } from 'src/app/modules/shared/services/data.service';
//import { UserState } from './reducers/user.state';
import { reducers } from './store/reducers';
import { Router, RouterModule, Routes } from '@angular/router';
import { ThemeService } from './services/theme.service';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['user'], rehydrate: true})(reducer);
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

// const defaultTheme: Routes = [
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
//       import('./modules/theme/default/store.module').then(m => m.StoreModule)
//   },   
//   {
//     path: 'iddock',
//     loadChildren: () =>
//       import('./modules/iddock/iddock.module').then(m => m.IddockModule)
//   },   
//   {
//     path: 'admin',
//     loadChildren: () =>
//       import('src/app/modules/admin/admin.module').then(m => m.AdminModule)
//   },
//   {
//     path: 'merchant',
//     loadChildren: () =>
//       import('src/app/modules/merchant/merchant.module').then(m => m.MerchantModule)
//   },
//   {
//     path: 'account',
//     loadChildren: () =>
//       import('src/app/modules/account/account.module').then(m => m.AccountModule)
//   },
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     path: 'wallet',
//     loadChildren: () =>
//       import('src/app/modules/wallet/wallet.module').then(m => m.WalletModule)
//   },
//   {
//     path: 'nft',
//     loadChildren: () =>
//       import('src/app/modules/nft/nft.module').then(m => m.NftModule)
//   },
// ];

// const madEarn: Routes = [
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
//       import('./modules/theme/mad-earn/madearn.module').then(m => m.MadearnModule)
//   },   
//   {
//     path: 'iddock',
//     loadChildren: () =>
//       import('./modules/iddock/iddock.module').then(m => m.IddockModule)
//   },   
//   {
//     path: 'admin',
//     loadChildren: () =>
//       import('src/app/modules/admin/admin.module').then(m => m.AdminModule)
//   },
//   {
//     path: 'merchant',
//     loadChildren: () =>
//       import('src/app/modules/merchant/merchant.module').then(m => m.MerchantModule)
//   },
//   {
//     path: 'account',
//     loadChildren: () =>
//       import('src/app/modules/account/account.module').then(m => m.AccountModule)
//   },
//   {
//     path: 'auth',
//     loadChildren: () =>
//       import('src/app/modules/auth/auth.module').then(m => m.AuthModule)
//   },
//   {
//     path: 'wallet',
//     loadChildren: () =>
//       import('src/app/modules/wallet/wallet.module').then(m => m.WalletModule)
//   },
//   {
//     path: 'nft',
//     loadChildren: () =>
//       import('src/app/modules/nft/nft.module').then(m => m.NftModule)
//   },
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


const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
  declarations: [
    AppComponent,
    // MenuMobileComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    StoreModule.forRoot(reducers, {metaReducers}),   
    HttpClientModule,
    StorageModule.forRoot({ IDBNoWrap: true, }),
    TranslateModule.forRoot(),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    TranslateModule.forRoot(
      {
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }
    ),

  ],
  exports:[RouterModule],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
