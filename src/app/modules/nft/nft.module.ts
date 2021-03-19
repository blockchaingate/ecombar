import { NgModule } from '@angular/core';
import { NftRoutingModule } from './nft-routing.module';
import { NftComponent } from './nft.component';
import { NftHeaderComponent } from './components/header/header.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftAdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { TextHeaderComponent } from './components/common/text-header/text-header.component';
import { ImageUploaderComponent } from './components/common/image-uploader/image-uploader.component';
import { TextboxComponent } from './components/common/textbox/textbox.component';
import { TextareaComponent } from './components/common/textarea/textarea.component';
import { TextareaSwitchComponent } from './components/common/textarea-switch/textarea-switch.component';
import { FormTraitComponent } from './components/common/form-trait/form-trait.component';
import { NftCollectionsListComponent } from './components/collections-list/collections-list.component';
import { NftCollectionsAddComponent } from './components/collections-add/collections-add.component';
import { NftCollectionsAddDoneComponent } from './components/collections-add-done/collections-add-done.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionEditTopbarComponent } from './components/collection-edit-topbar/collection-edit-topbar.component';
import { NftCollectionEditHeaderComponent } from './components/collection-edit-header/collection-edit-header.component';
import { NftCollectionEditItemsComponent } from './components/collection-edit-items/collection-edit-items.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';
import { NftCollectionAssetsCreateDoneComponent } from './components/collection-assets-create-done/collection-assets-create-done';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@NgModule({
    declarations: [
      NftComponent,
      NftHeaderComponent,
      NftAdminComponent,
      NftAdminSidebarComponent,
      NftCollectionsComponent,
      TextHeaderComponent,
      NftCollectionsListComponent,
      NftCollectionsAddComponent,
      NftCollectionsAddDoneComponent,
      NftCollectionEditComponent,
      NftCollectionEditTopbarComponent,
      NftCollectionEditHeaderComponent,
      NftCollectionEditItemsComponent,
      NftCollectionAssetsCreateComponent,
      ImageUploaderComponent,
      TextboxComponent,
      TextareaComponent,
      FormTraitComponent,
      TextareaSwitchComponent,
      NftCollectionAssetsCreateDoneComponent
    ],
    imports: [
        NftRoutingModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot()
    ]    
})

export class NftModule { }