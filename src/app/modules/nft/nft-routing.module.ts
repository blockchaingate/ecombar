import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';

const routes: Routes = [
    {
      path: '', component: NftComponent,
    },
    {
        path: 'admin', component: NftAdminComponent,
        children: [
            {
                path: 'collections', component: NftCollectionsComponent
            }            
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class NftRoutingModule { }