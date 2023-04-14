import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreApproveComponent } from './pages/store-approve/store-approve.component';
import { ExchangeRateComponent } from './pages/exchange-rate/exchange-rate.component';
import { FeeDistributionComponent } from './pages/fee-distribution/fee-distribution.component';
import { ExchangeRateAddComponent } from './pages/exchange-rate-add/exchange-rate-add.component';
import { FeeDistributionUpdateRewardCoinsComponent } from './pages/fee-distribution-update-reward-coins/fee-distribution-update-reward-coins.component';
import { FeeDistributionUpdateRewardPercentagesComponent } from './pages/fee-distribution-update-reward-percentages/fee-distribution-update-reward-percentages.component';
import { FeeDistributionUpdatePaymentFeeRateComponent } from './pages/fee-distribution-update-payment-fee-rate/fee-distribution-update-payment-fee-rate.component';

import { 
  WalletGuardService as WalletGuard 
} from 'src/app/modules/shared/services/wallet-guard.service';

const routes: Routes = [
  {
    path: '', component: AdminComponent,
    canActivate: [WalletGuard], 
    children: [
      {
        path: 'dashboard', component: DashboardComponent
      },
      {
        path: 'stores', component: StoresComponent
      },  
      {
        path: 'store/:id/approve', component: StoreApproveComponent
      },           
      {
        path: 'exchange-rate', component: ExchangeRateComponent
      },
      {
        path: 'exchange-rate/:coinName/edit', component: ExchangeRateAddComponent
      },
      {
        path: 'fee-distribution', component: FeeDistributionComponent
      },
      {
        path: 'fee-distribution/update-reward-coins', component: FeeDistributionUpdateRewardCoinsComponent
      },
      {
        path: 'fee-distribution/update-reward-percentages', component: FeeDistributionUpdateRewardPercentagesComponent
      },
      {
        path: 'fee-distribution/update-payment-fee-rate', component: FeeDistributionUpdatePaymentFeeRateComponent
      },
      {
        path: '', 
        redirectTo: 'dashboard',
        pathMatch: 'full',
  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
