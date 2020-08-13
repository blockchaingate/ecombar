import { NgModule, ModuleWithProviders } from '@angular/core';
import { CartStoreService } from './services/cart.store.service';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ]
})
export class SharedModule {
  public static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        CartStoreService,
        ApiService
      ]  
    };
  }
}