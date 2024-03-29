import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NftRoutingModule } from './nft-routing.module';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { NftComponent } from './nft.component';
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
import { NftCollectionViewComponent } from './components/collection-view/collection-view.component';
import { NftCollectionEditComponent } from './components/collection-edit/collection-edit.component';
import { NftCollectionViewTopbarComponent } from './components/collection-view-topbar/collection-view-topbar.component';
import { NftCollectionViewHeaderComponent } from './components/collection-view-header/collection-view-header.component';
import { NftCollectionViewItemsComponent } from './components/collection-view-items/collection-view-items.component';
import { NftCollectionAssetsCreateComponent } from './components/collection-assets-create/collection-assets-create.component';
import { NftCollectionAssetsCreateDoneComponent } from './components/collection-assets-create-done/collection-assets-create-done';
import { PropertiesComponent } from './components/common/form-trait/modals/properties/properties.component';
import { LevelsComponent } from './components/common/form-trait/modals/levels/levels.component';
import { ExpansionComponent } from './components/common/expansion/expansion.component';
import { NftAssetSellComponent } from './components/asset-sell/asset-sell.component';
import { NftRankingsComponent } from './components/rankings/rankings.component';
import { NftAccountActivityComponent } from './components/account-activity/account-activity.component';
import { NftAccountOffersComponent } from './components/account-offers/account-offers.component';
import { NftUnlockableContentComponent } from './modals/unlockable-content/unlockable-content.component';
import { NftAccountFavoritesComponent } from './components/account-favorites/account-favorites.component';
import { NftAssetOverviewComponent } from './components/asset-overview/asset-overview.component';
import { NftAssetSellMethodComponent } from './components/asset-sell-method/asset-sell-method.component';
import { NftAssetSellPriceComponent } from './components/asset-sell-price/asset-sell-price.component';
import { NftAssetSellQuantityComponent } from './components/asset-sell-quantity/asset-sell-quantity.component';
import { NftAssetSellIncludeEndingPrinceComponent } from './components/asset-sell-include-ending-price/asset-sell-include-ending-price.component';
import { NftAssetSellScheduleForFutureTimeComponent } from './components/asset-sell-schedule-for-future-time/asset-sell-schedule-for-future-time.component';
import { NftAssetSellPrivacyComponent } from './components/asset-sell-privacy/asset-sell-privacy.component';
import { NftAssetSellInstructionsComponent } from './components/asset-sell-instructions/asset-sell-instructions.component';
import { NftAssetSellSummaryComponent } from './components/asset-sell-summary/asset-sell-summary.component';
import { NftAssetSellSummaryListingComponent } from './components/asset-sell-summary-listing/asset-sell-summary-listing.component';
import { NftAssetSellSummaryBountiesComponent } from './components/asset-sell-summary-bounties/asset-sell-summary-bounties.component';
import { NftAssetSellSummaryFeesComponent } from './components/asset-sell-summary-fees/asset-sell-summary-fees.component';
import { NftAccountInWalletCurrencyComponent } from './components/account-in-wallet-currency/account-in-wallet-currency.component';
import { NftAssetComponent } from './components/asset/asset.component';
import { NftAccountActivityEventTypeComponent } from './components/account-activity-event-type/account-activity-event-type.component';
import { NftAssetEventsComponent } from './components/asset-events/asset-events.component';
import { NftAssetActionComponent } from './components/asset-action/asset-action.component';
import { NftAssetImageComponent } from './components/asset-image/asset-image.component';
import { NftAssetDetailsComponent } from './components/asset-details/asset-details.component';
import { NftAssetInfoComponent } from './components/asset-info/asset-info.component';
import { NftAccountComponent } from './components/account/account.component';
import { NftSettingsComponent } from './components/settings/settings.component';
import { NftAccountOverviewComponent } from './components/account-overview/account-overview.component';
import { NftAccountTabComponent } from './components/account-tab/account-tab.component';
import { NftAccountInWalletComponent } from './components/account-in-wallet/account-in-wallet.component';
import { NftAccountInWalletSearchComponent } from './components/account-in-wallet-search/account-in-wallet-search.component';
import { NftAccountInWalletAssetsComponent } from './components/account-in-wallet-assets/account-in-wallet-assets.component';
import { NftAccountInWalletAssetComponent } from './components/account-in-wallet-asset/account-in-wallet-asset.component';
import { NftCancelListingComponent } from './modals/cancel-listing/cancel-listing.component';
import { NftPriceChangeComponent } from './modals/price-change/price-change.component';
import { NftTransferComponent } from './components/transfer/transfer.component';
import { NftAssetPriceHistoryComponent } from './components/asset-price-history/asset-price-history.component';
import { NftAssetsComponent } from './components/assets/assets.component';
import { NftIndexComponent } from './components/index/index.component';
import { NftGetStartedComponent } from './components/get-started/get-started.component';
import { NftPropertiesListComponent } from './components/properties-list/properties-list.component';
import { NftLevelsListComponent } from './components/levels-list/levels-list.component';
import { NftAssetListingComponent } from './components/asset-listing/asset-listing.component';
import { NftAssetOffersComponent } from './components/asset-offers/asset-offers.component';
import { NftActivitiesComponent } from './components/activities/activities.component';
import { NftAccountInWalletPillsComponent } from './components/account-in-wallet-pills/account-in-wallet-pills.component';
import { NftAccountInWalletCollectionsComponent } from './components/account-in-wallet-collections/account-in-wallet-collections.component';
import { NftCollectionService } from './services/nft-collection.service';
import { NftAssetService } from './services/nft-asset.service';
import { NftOrderService } from './services/nft-order.service';
import { NftTradeService } from './services/nft-trade.service';
import { NftEventService } from './services/nft-event.service';
import { NftSettingService } from './services/nft-setting.service';
import { NftFavoriteService } from './services/nft-favorite.service';
import { NftPortService } from './services/nft-port.service';
// import { UploadService } from './services/upload.service';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NftActivitiesPageComponent } from './components/activities-page/activities-page.component';
import { NftAccountOffersTableComponent } from './components/account-offers-table/account-offers-table.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NftMakeOfferComponent } from './modals/make-offer/make-offer.component';
import { WalletModule } from '../wallet/wallet.module';

import { AssetsSearchPipe } from './pipes/assets-search.pipe';
import { EventsSearchPipe } from './pipes/events-search.pipe';
@NgModule({
    declarations: [
      NftComponent,
      NftAdminComponent,
      NftAssetSellQuantityComponent,
      NftActivitiesComponent,
      NftAdminSidebarComponent,
      NftAccountActivityEventTypeComponent,
      NftActivitiesPageComponent,
      NftCollectionsComponent,
      TextHeaderComponent,
      AssetsSearchPipe,
      EventsSearchPipe,
      NftAccountOffersTableComponent,
      NftRankingsComponent,
      NftAccountActivityComponent,
      NftSettingsComponent,
      NftUnlockableContentComponent,
      NftAccountInWalletPillsComponent,
      NftCollectionsListComponent,
      NftAccountInWalletCollectionsComponent,
      NftCollectionsAddComponent,
      NftAccountInWalletCurrencyComponent,
      NftAccountOffersComponent,
      NftAccountFavoritesComponent,
      NftCollectionsAddDoneComponent,
      NftCollectionViewTopbarComponent,
      NftCollectionViewHeaderComponent,
      NftCollectionViewItemsComponent,
      NftCollectionAssetsCreateComponent,
      NftAssetSellComponent,
      NftTransferComponent,
      NftAssetPriceHistoryComponent,
      ImageUploaderComponent,
      TextboxComponent,
      NftCancelListingComponent,
      NftPriceChangeComponent,
      NftMakeOfferComponent,
      NftAssetListingComponent,
      NftAssetOffersComponent,
      TextareaComponent,
      FormTraitComponent,
      PropertiesComponent,
      LevelsComponent,
      NftAssetOverviewComponent,
      ButtonComponent,
      NftGetStartedComponent,
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
      NftCollectionViewComponent,
      NftCollectionEditComponent,
      NftAssetComponent,
      NftAssetEventsComponent,
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
      LevelsComponent,
      NftMakeOfferComponent,
      NftPriceChangeComponent,
      NftUnlockableContentComponent,
      NftCancelListingComponent
    ],
    providers: [
      NftCollectionService,
      NftAssetService,
      NftOrderService,
      NftTradeService,
      NftEventService,
      NftSettingService,
      NftFavoriteService,
      // UploadService,
      NftPortService
    ],
    imports: [
        NftRoutingModule,
        FormsModule,
        NgxSpinnerModule,
        CommonModule,
        NgxChartsModule,
        WalletModule,
        SharedModule,
        ModalModule.forRoot()
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]    
})

export class NftModule { }