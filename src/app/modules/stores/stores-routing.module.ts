import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { StoresComponent } from './stores.component';
import { StoresIndexComponent } from './components/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: StoresComponent,
    children: [
      {
        path: '', component: StoresIndexComponent
      },      
    ]
  }
];
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StoresRoutingModule { }
