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
import { TransactionDetailComponent } from './modals/transaction-detail/transaction-detail.component';
import { ReceiveComponent } from './modals/receive/receive.component';
import { SendComponent } from './modals/send/send.component';
import { LoginSettingModal } from './modals/login-setting/login-setting.modal';
import { ShowSeedPhraseModal } from './modals/show-seed-phrase/show-seed-phrase.modal';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { ModalModule } from 'ngx-bootstrap/modal';

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
        ConfirmMnemonicsComponent,
        TransactionDetailComponent,
        ReceiveComponent,
        SendComponent,
        LoginSettingModal,
        ShowSeedPhraseModal
    ],
    imports: [
        WalletRoutingModule,
        QRCodeModule,
        SharedModule,
        FormsModule, 
        ReactiveFormsModule,
        CommonModule,
        ModalModule.forRoot(),
        NgxSmartModalModule.forRoot(),
        NgxBootstrapSwitchModule.forRoot()
    ]
})
export class WalletModule { }