import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';

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
              path: 'collection/:name/assets/edit', component: NftCollectionEditComponent
          }                        
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NftRoutingModule { }