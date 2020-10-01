import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';
import { MerchantsComponent } from './pages/merchants/merchants.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductAddComponent } from './pages/product-add/product-add.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryAddComponent } from './pages/category-add/category-add.component';
import { UserAddComponent } from './pages/user-add/user-add.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },  
      { 
        path: 'users',
        component: UsersComponent
      },  
      { 
        path: 'products',
        component: ProductsComponent
      },  
      { 
        path: 'product/add',
        component: ProductAddComponent
      }, 
      { 
        path: 'categories',
        component: CategoriesComponent
      },  
      { 
        path: 'category/add',
        component: CategoryAddComponent
      },  
      { 
        path: 'category/:id/edit',
        component: CategoryAddComponent
      },        
      { 
        path: 'user/:id/edit',
        component: UserAddComponent
      },                           
      { 
        path: 'merchants',
        component: MerchantsComponent
      }              
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }