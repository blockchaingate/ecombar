import { NgModule } from '@angular/core';
import { WalletRoutingModule } from './wallet-routing.module';
import { WalletDashboardComponent } from './components/wallet-dashboard/wallet-dashboard.component';
import { MnemonicComponent } from './components/mnemonic/mnemonic.component';
import { MnemeditComponent } from './components/mnemonic/mnemedit.component';
import { NoWalletComponent } from './components/create-wallet/no-wallet.component';
import { WalletPwdComponent } from './components/create-wallet/wallet-pwd.component';
import { CreateWalletComponent } from './components/create-wallet/create-wallet.component';
import { ConfirmMnemonicsComponent } from './components/create-wallet/confirmmnem.component';
import { ImportWalletComponent } from './components/import-wallet/import-wallet.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        WalletDashboardComponent,
        NoWalletComponent,
        MnemonicComponent,
        MnemeditComponent,
        CreateWalletComponent,
        ImportWalletComponent,     
        WalletPwdComponent,
        MnemonicComponent,
        MnemeditComponent,   
        WalletPwdComponent,
        ConfirmMnemonicsComponent
    ],
    imports: [
        WalletRoutingModule,
        QRCodeModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        NgxSmartModalModule.forRoot()
    ]
})
export class WalletModule { }