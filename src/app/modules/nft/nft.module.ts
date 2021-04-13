import { NgModule } from '@angular/core';
import { NftRoutingModule } from './nft-routing.module';
import { NftComponent } from './nft.component';
import { NftHeaderComponent } from './components/header/header.component';
import { NftAdminComponent } from './components/admin/admin.component';
import { NftAdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { NftCollectionsComponent } from './components/collections/collections.component';
import { ButtonComponent } from './components/common/button/button.component';
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
import { PropertiesComponent } from './components/common/form-trait/modals/properties/properties.component';
import { LevelsComponent } from './components/common/form-trait/modals/levels/levels.component';
import { ExpansionComponent } from './components/common/expansion/expansion.component';
import { NftAssetSellComponent } from './components/asset-sell/asset-sell.component';
import { NftAssetOverviewComponent } from './components/asset-overview/asset-overview.component';
import { NftAssetSellMethodComponent } from './components/asset-sell-method/asset-sell-method.component';
import { NftAssetSellPriceComponent } from './components/asset-sell-price/asset-sell-price.component';
import { NftAssetSellIncludeEndingPrinceComponent } from './components/asset-sell-include-ending-price/asset-sell-include-ending-price.component';
import { NftAssetSellScheduleForFutureTimeComponent } from './components/asset-sell-schedule-for-future-time/asset-sell-schedule-for-future-time.component';
import { NftAssetSellPrivacyComponent } from './components/asset-sell-privacy/asset-sell-privacy.component';
import { NftAssetSellInstructionsComponent } from './components/asset-sell-instructions/asset-sell-instructions.component';
import { NftAssetSellSummaryComponent } from './components/asset-sell-summary/asset-sell-summary.component';
import { NftAssetSellSummaryListingComponent } from './components/asset-sell-summary-listing/asset-sell-summary-listing.component';
import { NftAssetSellSummaryBountiesComponent } from './components/asset-sell-summary-bounties/asset-sell-summary-bounties.component';
import { NftAssetSellSummaryFeesComponent } from './components/asset-sell-summary-fees/asset-sell-summary-fees.component';

import { NftAssetComponent } from './components/asset/asset.component';
import { NftAssetActionComponent } from './components/asset-action/asset-action.component';
import { NftAssetImageComponent } from './components/asset-image/asset-image.component';
import { NftAssetDetailsComponent } from './components/asset-details/asset-details.component';
import { NftAssetInfoComponent } from './components/asset-info/asset-info.component';

import { NftAccountComponent } from './components/account/account.component';
import { NftAccountOverviewComponent } from './components/account-overview/account-overview.component';
import { NftAccountTabComponent } from './components/account-tab/account-tab.component';
import { NftAccountInWalletComponent } from './components/account-in-wallet/account-in-wallet.component';
import { NftAccountInWalletSearchComponent } from './components/account-in-wallet-search/account-in-wallet-search.component';
import { NftAccountInWalletAssetsComponent } from './components/account-in-wallet-assets/account-in-wallet-assets.component';
import { NftAccountInWalletAssetComponent } from './components/account-in-wallet-asset/account-in-wallet-asset.component';

import { NftAssetsComponent } from './components/assets/assets.component';
import { NftIndexComponent } from './components/index/index.component';

import { NftPropertiesListComponent } from './components/properties-list/properties-list.component';
import { NftLevelsListComponent } from './components/levels-list/levels-list.component';

import { NftCollectionService } from './services/nft-collection.service';
import { NftAssetService } from './services/nft-asset.service';
import { UploadService } from './services/upload.service';

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
      NftAssetSellComponent,
      ImageUploaderComponent,
      TextboxComponent,
      TextareaComponent,
      FormTraitComponent,
      PropertiesComponent,
      LevelsComponent,
      NftAssetOverviewComponent,
      ButtonComponent,
      TextareaSwitchComponent,
      NftAssetSellMethodComponent,
      NftCollectionAssetsCreateDoneComponent,
      NftAssetSellPriceComponent,
      NftAssetSellIncludeEndingPrinceComponent,
      NftAssetSellScheduleForFutureTimeComponent,
      NftAssetSellPrivacyComponent,
      NftAssetSellInstructionsComponent,
      NftAssetSellSummaryComponent,
      NftAssetSellSummaryListingComponent,
      NftAssetSellSummaryBountiesComponent,
      NftAssetSellSummaryFeesComponent,
      NftAssetComponent,
      NftAssetActionComponent,
      NftAssetImageComponent,
      NftAssetDetailsComponent,
      ExpansionComponent,
      NftAssetInfoComponent,
      NftAccountComponent,
      NftAccountOverviewComponent,
      NftAccountTabComponent,
      NftAccountInWalletComponent,
      NftAccountInWalletSearchComponent,
      NftAccountInWalletAssetsComponent,
      NftAccountInWalletAssetComponent,
      NftAssetsComponent,
      NftIndexComponent,
      NftPropertiesListComponent,
      NftLevelsListComponent
    ],
    entryComponents:[
      PropertiesComponent, 
      LevelsComponent
    ],
    providers: [
      NftCollectionService,
      NftAssetService,
      UploadService
    ],
    imports: [
        NftRoutingModule,
        FormsModule,
        CommonModule,
        ModalModule.forRoot()
    ]    
})

export class NftModule { }