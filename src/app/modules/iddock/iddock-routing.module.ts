import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationComponent } from './verification.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { OwnerComponent } from './owner/owner.component';
import { HistoryComponent } from './history/history.component';
import { DetailComponent } from './detail/detail.component';
import { DetailBySequenceIDComponent } from './detail-by-sequence-id/detail-by-sequence-id.component';

const routes: Routes = [
  {
    path: '',
    component: VerificationComponent
  },
  {
    path: 'verification',
    component: VerificationComponent
  },
  { path: 'detail/:type/:id', component: DetailComponent },
  { path: 'detail-by-sequence-id/:type/:id', component: DetailBySequenceIDComponent },
  { path: 'history/:type/:id', component: HistoryComponent },
  { path: 'update-info/:type/:id', component: UpdateInfoComponent },
  { path: 'owner/:type/:id', component: OwnerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IddockRoutingModule { }