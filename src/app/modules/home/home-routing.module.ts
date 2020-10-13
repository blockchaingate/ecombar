import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
        import('./index/index.module').then(m => m.IndexModule)
      },
      {
        path: 'category',
        loadChildren: () =>
        import('./category/category.module').then(m => m.CategoryModule)
      },      
      {
        path: 'cart',
        loadChildren: () =>
        import('./cart/cart.module').then(m => m.CartModule)
      },      
      {
        path: 'address',
        loadChildren: () =>
        import('./address/address.module').then(m => m.AddressModule)
      },        
      {
        path: 'activate',
        loadChildren: () =>
        import('./activate/activate.module').then(m => m.ActivateModule)
      }             
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }


