import { NgModule } from '@angular/core';
import { NftRoutingModule } from './nft-routing.module';
import { NftComponent } from './nft.component';
import { NftHeaderComponent } from './components/header/header.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftCollectionsComponent } from './components/collections/collections.component';

@NgModule({
    declarations: [
      NftComponent,
      NftHeaderComponent,
      NftAdminComponent,
      NftCollectionsComponent
    ],
    imports: [
        NftRoutingModule
    ]    
})

export class NftModule { }