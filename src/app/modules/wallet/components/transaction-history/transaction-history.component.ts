import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { TransactionItem } from 'src/app/models/transaction-item';
import { CoinsPrice } from 'src/app/interfaces/balance.interface';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { ApiService } from 'src/app/modules/shared/services/api.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { TransactionDetailComponent } from '../../modals/transaction-detail/transaction-detail.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';


@Component({
    selector: 'app-transaction-history',
    templateUrl: './transaction-history.component.html',
    styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
    transactionHistory: TransactionItem[];
    @Input() walletId: string;
    @Input() transactions: any;

    currentType: string;
    utilServ: UtilService;

    constructor(
        private modalServ: BsModalService,
        private storageService: StorageService,
        utilServ: UtilService,
        private kanbanServ: KanbanService
    ) {
        this.utilServ = utilServ;
    }

    changeType(type: string) {
        this.currentType = type;
    }

    showCoinName(name: string) {
        if(name == 'USDT') {
            return 'USDT(ERC20)';
        } else 

        if(name == 'TRON_USDT') {
            return 'USDT(TRC20)';
        } else 
        if (name == 'ETH_FAB') {
            return 'FAB(ERC20)'
        } else
        if (name == 'ETH_EXG') {
            return 'EXG(ERC20)'
        } else 
        if (name == 'ETH_DSC') {
            return 'DSC(ERC20)'
        } else
        if (name == 'ETH_BST') {
            return 'BST(ERC20)'
        }
        return name;
    }
    mergeSortedArray(a,b){

        var tempArray = [];
        var currentPos = {
            a: 0,
            b: 0
        }
        while(currentPos.a < a.length && currentPos.b < b.length) {

            if(typeof a[currentPos.a] === 'undefined') {
                tempArray.push(b[currentPos.b++]);
            } else if(a[currentPos.a].timestamp > b[currentPos.b].timestamp){
                tempArray.push(a[currentPos.a++]);
            } else {
                tempArray.push(b[currentPos.b++]);
            }
        }

        while(currentPos.a < a.length) {
            tempArray.push(a[currentPos.a++]);
        }

        while(currentPos.b < b.length) {
            tempArray.push(b[currentPos.b++]);
        }        
        return tempArray;
    }


    ngOnInit() {
        this.currentType = 'All';
        this.storageService.getTransactionHistoryList().subscribe(
            (transactionHistory: TransactionItem[]) => {
                //console.log('transactionHistory=', transactionHistory);
                if (transactionHistory && (transactionHistory.length > 0)) {
                    //this.transactionHistory = transactionHistory.reverse().filter(s => s.walletId === this.walletId);
                    let newTransactions = [];
                    for(let i=transactionHistory.length - 1;i >= 0; i--) {
                        const transactionItem = transactionHistory[i];
                        const time = transactionItem.time;
                        const timestamp = Math.round(time.getTime() / 1000);

                        const wid = transactionItem.walletId;
                        if(wid != this.walletId) {
                            continue;
                        }
                        const newTransaction = {
                            action: transactionItem.type,
                            coin: transactionItem.coin,
                            quantity: transactionItem.amount,
                            to: transactionItem.to,
                            timestamp: timestamp,
                            comment: transactionItem.comment,
                            transactions: [
                                {
                                    chain: transactionItem.tokenType ? transactionItem.tokenType : transactionItem.coin,
                                    status: transactionItem.status,
                                    timestamp: '',
                                    transactionId: transactionItem.txid
                                }                               
                            ]
                        };

                        newTransactions.push(newTransaction);
                    }

                    this.transactions = this.mergeSortedArray(this.transactions, newTransactions);

                }
            }
        );
    }

    async showTransactionDetail2(item: any) {
        const initialState = {
            item
          }        
        this.modalServ.show(TransactionDetailComponent, {initialState});
    }

}
