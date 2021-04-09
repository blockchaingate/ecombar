import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';
import { NftCollectionAssetsCreateDoneComponent } from './components/collection-assets-create-done/collection-assets-create-done';
import { NftAssetSellComponent } from './components/asset-sell/asset-sell.component';
import { NftAssetComponent } from './components/asset/asset.component';
import { NftAssetsComponent } from './components/assets/assets.component';
import { NftAccountComponent } from './components/account/account.component';
import { NftIndexComponent } from './components/index/index.component';

const routes: Routes = [
    {
      path: '', component: NftComponent,
    },
    {
      path: 'assets', component: NftAssetsComponent
    },      
    {
      path: 'asset', component: NftAssetComponent
    },   
    {
      path: 'account', component: NftAccountComponent
    },        
    {
        path: 'admin', component: NftAdminComponent,
        children: [
            {
                path: 'collections', component: NftCollectionsComponent
            },
            {
              path: 'asset/sell', component: NftAssetSellComponent
            },            
            {
              path: 'collections/:slug/assets/edit', component: NftCollectionEditComponent
            },
            {
              path: 'collections/:slug/assets/create', component: NftCollectionAssetsCreateComponent
            },
            {
              path: 'collections/:slug/assets/create-done', component: NftCollectionAssetsCreateDoneComponent
            }                             
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NftRoutingModule { }