import { Component, ViewChild} from '@angular/core';
import {  ModalDirective } from 'ngx-bootstrap/modal';
import { TransactionItem } from '../../../../models/transaction-item';
import {UtilService} from 'src/app/modules/shared/services/util.service';
import {environment} from '../../../../../environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'transaction-detail-component',
    templateUrl: './transaction-detail.component.html',
    styleUrls: ['./transaction-detail.component.scss']
})
export class TransactionDetailComponent {
    item: any;
    utilService: UtilService;
    production: boolean;

    constructor (public modalRef: BsModalRef, _utilServ: UtilService) {
        this.utilService = _utilServ;
        this.production = environment.production;
    }

    close() {
        this.modalRef.hide();
    }

    getTo(item) {
        let toFormat = '';
        if(!item) {
            toFormat = '';
            return toFormat;
        }
        if(item.coin == 'EXG') {
            toFormat = this.utilService.exgToFabAddress(item.to);
        } else {
            toFormat = item.to;
        }

        return toFormat;
    }

    getTxidText(txid:string) {
        if(!txid) {
            return '';
        }
        return txid.substring(0,3) + '...' + txid.substring(txid.length - 3);
    }

    getTxUrl(tx) {
        const chain = tx.chain;
        const txid = tx.transactionId;
        if(chain == 'KANBAN') {
            return  environment.endpoints['website'] + 'explorer/tx-detail/' + txid;
        } else
        if(chain == 'BTC') {
            const baseUrl = this.production ? 'https://live.blockcypher.com/btc' : 'https://live.blockcypher.com/btc-testnet';
            return baseUrl + '/tx/' + txid + '/';
        } else
        if(chain == 'ETH') {
            const baseUrl = this.production ? 'https://etherscan.io' : 'https://ropsten.etherscan.io';
            return baseUrl + '/tx/' + txid;
        } else
        if(chain == 'FAB') {
            const baseUrl = this.production ? 'https://fabexplorer.info' : 'https://test.fabcoin.org'
            return baseUrl + '/#/transactions/' + txid;
        } else
        if(chain == 'LTC') {
            return 'https://live.blockcypher.com/ltc/tx/' + txid + '/';
        } else
        if(chain == 'DOGE') {
            return 'https://dogechain.info/tx/' + txid;
        } else
        if(chain == 'BCH') {
            return 'https://explorer.bitcoin.com/bch/tx/' + txid;
        } else
        if(chain == 'TRX') {
            return 'https://tronscan.org/#/transaction/' + txid;
        }
        return "";  // 来到这里，明显有问题
    }
   
}
