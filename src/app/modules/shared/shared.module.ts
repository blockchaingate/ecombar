import { NgModule, ModuleWithProviders } from '@angular/core';
import { CartStoreService } from './services/cart.store.service';
import { ApiService } from './services/api.service';
import { UserService } from './services/user.service';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { CollectionService } from './services/collection.service';
import { OrderService } from './services/order.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';

@NgModule({
  imports: [
  ],
  exports: [
  ],
  providers: [
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
        StorageService,
        ProductService,
        UploadService,
        CategoryService,
        CollectionService,
        OrderService
      ]  
    };
  }
}