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
import { AddGasComponent } from './modals/add-gas/add-gas.component';
import { DepositComponent } from './modals/deposit/deposit.component';
import { WithdrawComponent } from './modals/withdraw/withdraw.component';
import { LoginSettingModal } from './modals/login-setting/login-setting.modal';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { ShowSeedPhraseModal } from './modals/show-seed-phrase/show-seed-phrase.modal';
import { CoinsListComponent } from './components/coins-list/coins-list.component';
import { QRCodeModule } from 'angularx-qrcode';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { CommonModule } from '@angular/common';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@NgModule({
    declarations: [
        WalletDashboardComponent,
        NoWalletComponent,
        MnemonicComponent,
        MnemeditComponent,
        CoinsListComponent,
        CreateWalletComponent,
        ImportWalletComponent,   
        TransactionHistoryComponent,  
        WalletPwdComponent,
        MnemonicComponent,
        MnemeditComponent,   
        WalletPwdComponent,
        ConfirmMnemonicsComponent,
        TransactionDetailComponent,
        ReceiveComponent,
        SendComponent,
        AddGasComponent,
        DepositComponent,
        WithdrawComponent,
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
        BsDropdownModule.forRoot(),
        NgxSmartModalModule.forRoot(),
        NgxBootstrapSwitchModule.forRoot()
    ],
    exports: [
        NoWalletComponent
    ]
})
export class WalletModule { }