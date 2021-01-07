import { NgModule, ModuleWithProviders } from '@angular/core';
import { CartStoreService } from './services/cart.store.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { BannerService } from './services/banner.service';
import { BrandService } from './services/brand.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CollectionService } from './services/collection.service';
import { OrderService } from './services/order.service';
import { PaymentService } from './services/payment.service';
import { AddressService } from './services/address.service';
import { FavoriteService } from './services/favorite.service';
import { CommentService } from './services/comment.service';
import { WalletService } from './services/wallet.service';
import { TranslateService } from './services/translate.service';
import { UtilService } from './services/util.service';
import { UploadService } from './services/upload.service';
import { ApiService } from './services/api.service';
import { Web3Service } from './services/web3.service';
import { CoinService } from './services/coin.service';
import { KanbanService } from './services/kanban.service';
import { ExcludeProductsPipe } from './pipes/exclude-products.pipe';
import { TranslateFieldPipe } from './pipes/translate-field.pipe';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ProductsGridComponent } from './components/products-grid/products-grid.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ExcludeProductsPipe,
    TranslateFieldPipe,
    ProductsGridComponent,
    StarRatingComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule.forChild({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    ExcludeProductsPipe,
    TranslateFieldPipe,
    ProductsGridComponent,
    StarRatingComponent,
    TranslateModule
  ],
  providers: [
    AuthGuardService,
    BrandService,
    TranslateService,
    FavoriteService,
    PaymentService,
    WalletService,
    CoinService,
    ApiService,
    Web3Service,
    CommentService,
    KanbanService
  ]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        TranslateService,
        AuthGuardService,
        PaymentService,
        FavoriteService,
        BrandService,
        WalletService,
        CommentService,
        CoinService,
        ApiService,
        Web3Service,        
        KanbanService
      ]
    };
  }
}