import { NgModule } from '@angular/core';
import { BlockchainRoutingModule } from './blockchain-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { VerificationComponent } from './verification.component';
import { UpdateInfoComponent } from './update-info/update-info.component';
import { OwnerComponent } from './owner/owner.component';
import { HistoryComponent } from './history/history.component';
import { DetailComponent } from './detail/detail.component';
import { DetailBySequenceIDComponent } from './detail-by-sequence-id/detail-by-sequence-id.component';

@NgModule({
  declarations: [
    VerificationComponent,
    UpdateInfoComponent,
    OwnerComponent,
    HistoryComponent,
    DetailComponent,
    DetailBySequenceIDComponent
  ],
  imports: [
    BlockchainRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot()
  ],
  providers: []
})
export class BlockchainModule { }
