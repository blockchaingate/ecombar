import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';

const routes: Routes = [
    {
      path: '', component: NftComponent,
    },
    {
        path: 'admin', component: NftAdminComponent,
        children: [
            {
                path: 'collections', component: NftCollectionsComponent
            },
            {
              path: 'collections/:name/assets/edit', component: NftCollectionEditComponent
            },
            {
              path: 'collections/:name/assets/create', component: NftCollectionAssetsCreateComponent
            }                          
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NftRoutingModule { }