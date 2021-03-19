import { NgModule } from '@angular/core';
import { NftRoutingModule } from './nft-routing.module';
import { NftComponent } from './nft.component';
import { NftHeaderComponent } from './components/header/header.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftAdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { NftCollectionsHeaderComponent } from './components/collections-header/collections-header.component';
import { NftCollectionsListComponent } from './components/collections-list/collections-list.component';
import { NftCollectionsAddComponent } from './components/collections-add/collections-add.component';
import { NftCollectionsAddDoneComponent } from './components/collections-add-done/collections-add-done.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionEditTopbarComponent } from './components/collection-edit-topbar/collection-edit-topbar.component';
import { NftCollectionEditHeaderComponent } from './components/collection-edit-header/collection-edit-header.component';
import { NftCollectionEditItemsComponent } from './components/collection-edit-items/collection-edit-items.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
      NftComponent,
      NftHeaderComponent,
      NftAdminComponent,
      NftAdminSidebarComponent,
      NftCollectionsComponent,
      NftCollectionsHeaderComponent,
      NftCollectionsListComponent,
      NftCollectionsAddComponent,
      NftCollectionsAddDoneComponent,
      NftCollectionEditComponent,
      NftCollectionEditTopbarComponent,
      NftCollectionEditHeaderComponent,
      NftCollectionEditItemsComponent,
      NftCollectionAssetsCreateComponent
    ],
    imports: [
        NftRoutingModule,
        FormsModule,
        ModalModule.forRoot()
    ]    
})

export class NftModule { }