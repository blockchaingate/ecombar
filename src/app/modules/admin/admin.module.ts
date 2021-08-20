import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { UploadMediaComponent } from './components/upload-media/upload-media.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { QRCodeModule } from 'angularx-qrcode';
import { RoleMenuPipe } from './pipes/role-menu.pipe';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreApproveComponent } from './pages/store-approve/store-approve.component';
import { ExchangeRateComponent } from './pages/exchange-rate/exchange-rate.component';
import { FeeDistributionComponent } from './pages/fee-distribution/fee-distribution.component';
import { ExchangeRateAddComponent } from './pages/exchange-rate-add/exchange-rate-add.component';
import { FeeDistributionUpdateRewardCoinsComponent } from './pages/fee-distribution-update-reward-coins/fee-distribution-update-reward-coins.component';
import { FeeDistributionUpdateRewardPercentagesComponent } from './pages/fee-distribution-update-reward-percentages/fee-distribution-update-reward-percentages.component';

@NgModule({
  declarations: [
    AdminComponent,
    UploadMediaComponent,
    DashboardComponent,
    RoleMenuPipe,
    StoresComponent,
    StoreApproveComponent,
    ExchangeRateComponent,
    FeeDistributionComponent,
    ExchangeRateAddComponent,
    FeeDistributionUpdateRewardCoinsComponent,
    FeeDistributionUpdateRewardPercentagesComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    FormsModule,
    QRCodeModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
    NgxSpinnerModule,
    RichTextEditorModule
  ],
  providers: []
})
export class AdminModule { }
