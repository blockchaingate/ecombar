import { NgModule, ModuleWithProviders } from '@angular/core';
import { CartStoreService } from './services/cart.store.service';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { BannerService } from './services/banner.service';
import { AuthService } from './services/auth.service';
import { AuthGuardService } from './services/auth-guard.service';
import { CollectionService } from './services/collection.service';
import { OrderService } from './services/order.service';
import { AddressService } from './services/address.service';
import { StorageService } from './services/storage.service';
import { TranslateService } from './services/translate.service';
import { UploadService } from './services/upload.service';
import { ExcludeProductsPipe } from './pipes/exclude-products.pipe';
import { TranslateFieldPipe } from './pipes/translate-field.pipe';
import {HttpClient} from '@angular/common/http';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { ProductsGridComponent } from './components/products-grid/products-grid.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    ExcludeProductsPipe,
    TranslateFieldPipe,
    ProductsGridComponent
  ],  
  imports: [
    FormsModule,
    CommonModule,
    TranslateModule.forChild({
      defaultLanguage: 'zh',
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
    TranslateModule
  ],
  providers: [
    AuthService,
    AuthGuardService,
    TranslateService    
  ]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        CartStoreService,
        ApiService,
        UserService,
        BannerService,
        StorageService,
        ProductService,
        UploadService,
        TranslateService,
        CategoryService,
        CollectionService,
        OrderService,
        AddressService,
        AuthService,
        AuthGuardService
      ]  
    };
  }
}