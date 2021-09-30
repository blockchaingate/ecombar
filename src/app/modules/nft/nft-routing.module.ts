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
import { NftActivitiesPageComponent } from './components/activities-page/activities-page.component';
import { NftTransferComponent } from './components/transfer/transfer.component';
import { NftSettingsComponent } from './components/settings/settings.component';
import { NftRankingsComponent } from './components/rankings/rankings.component';
import { NftAccountFavoritesComponent } from './components/account-favorites/account-favorites.component';
import { NftIndexComponent } from './components/index/index.component';
import { VersionComponent } from './version/version.component';
const routes: Routes = [
    {
      path: '', component: NftComponent,
      children: [
        {
          path: '', component: NftIndexComponent
        },
        {
          path: 'version', component: VersionComponent
        },  
        {
          path: 'assets', component: NftAssetsComponent
        },  
        {
          path: 'rankings', component: NftRankingsComponent
        },      
        {
          path: 'activities', component: NftActivitiesPageComponent
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
          path: 'assets/:smartContractAddress/:tokenId/edit', component: NftCollectionAssetsCreateComponent
        },  
        {
          path: 'account', component: NftAccountComponent
        }, 
        {
          path: 'account/settings', component: NftSettingsComponent
        },     
        {
          path: 'accounts/:address', component: NftAccountComponent
        },            
        {
            path: 'admin', component: NftAdminComponent,
            children: [
               {
                    path: 'favorites', component: NftAccountFavoritesComponent
               },          
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
      ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NftRoutingModule { }