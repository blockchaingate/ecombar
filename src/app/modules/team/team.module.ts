import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { RouterModule } from '@angular/router';
import { WalletModule } from '../wallet/wallet.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TeamRoutingModule } from './team-routing.module';
import { TeamComponent } from './team.component';
import { TeamIndexComponent } from './components/index/index.component';

@NgModule({
  declarations: [TeamComponent, TeamIndexComponent],
  imports: [
    CommonModule,
    TeamRoutingModule,
    SharedModule,
    RouterModule,
    FormsModule, 
    WalletModule,
    ReactiveFormsModule,
    QRCodeModule,
    ModalModule.forRoot()
  ]
})
export class TeamModule { }
