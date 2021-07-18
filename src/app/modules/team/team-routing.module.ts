import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TeamComponent } from './team.component';
import { TeamIndexComponent } from './components/index/index.component';

const routes: Routes = [
  {
    path: '',
    component: TeamComponent,
    children: [
        {
          path: '', component: TeamIndexComponent
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
export class TeamRoutingModule { }
