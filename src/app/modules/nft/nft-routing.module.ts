import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { NftCollectionViewComponent } from './components/collection-view/collection-view.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';
import { NftCollectionAssetsCreateDoneComponent } from './components/collection-assets-create-done/collection-assets-create-done';
import { NftAssetSellComponent } from './components/asset-sell/asset-sell.component';
import { NftAssetComponent } from './components/asset/asset.component';
import { NftAssetsComponent } from './components/assets/assets.component';
import { NftAccountComponent } from './components/account/account.component';
import { NftIndexComponent } from './components/index/index.component';
import { NftTransferComponent } from './components/transfer/transfer.component';
const routes: Routes = [
    {
      path: '', component: NftComponent,
    },
    {
      path: 'assets', component: NftAssetsComponent
    },      
    {
      path: 'assets/:smartContractAddress/:tokenId', component: NftAssetComponent
    },  
    {
      path: 'assets/:smartContractAddress/:tokenId/sell', component: NftAssetSellComponent
    },   
    {
      path: 'assets/:smartContractAddress/:tokenId/transfer', component: NftTransferComponent
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
              path: 'collections/:slug/edit', component: NftCollectionEditComponent
            },                      
            {
              path: 'collections/:slug/view', component: NftCollectionViewComponent
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