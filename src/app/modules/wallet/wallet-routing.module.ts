import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WalletPwdComponent } from './components/create-wallet/wallet-pwd.component';
import { ConfirmMnemonicsComponent } from './components/create-wallet/confirmmnem.component';
import { CreateWalletComponent } from './components/create-wallet/create-wallet.component';
import { ImportWalletComponent } from './components/import-wallet/import-wallet.component';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';

const routes: Routes = [
    {
        path: 'dashboard', component: WalletDashboardComponent
    },   
    {
        path: 'wallet-pwd', component: WalletPwdComponent
    },
    {
        path: 'confirm-mnemonics', component: ConfirmMnemonicsComponent
    }, 
    {
        path: 'create-wallet', component: CreateWalletComponent
    },  
    {
        path: 'wallet-pwd', component: WalletPwdComponent
    },       
    {
        path: 'confirm-words', component: ConfirmMnemonicsComponent
    },        
    {
        path: 'import-wallet', component: ImportWalletComponent
    },
    {
        path: '', redirectTo: 'dashboard'
    }          
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class WalletRoutingModule { }