import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { MyCoin } from '../../../../models/mycoin';
import { CoinService } from '../../../shared/services/coin.service';

@Component({
    selector: 'app-send-nft',
    templateUrl: './send-nft.component.html',
    styleUrls: ['./send-nft.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class SendNftComponent implements OnInit {
    public onClose: Subject<any>;
    coins: any;
    mycoin: MyCoin;
    addresses: any;
    sendAmount: number;
    currentCoin: string;
    to: string;
    isAdvance: boolean;
    comment: string;
    balance: number;
    contractType: string;
    onText: any;
    offText: any;
    onColor: any;
    offColor: any;
    size: any;
    disabled: boolean;
    gasPrice: number;
    gasLimit: number;
    satoshisPerByte: number;
    feeLimit: number;

    constructor(private modalRef: BsModalRef, private coinServ: CoinService) {}
    
    ngOnInit() {
      this.currentCoin = 'FAB';
    
      this.onClose = new Subject();
      this.isAdvance = false; 
      this.onText = 'Yes';
      this.offText = 'No';
      this.onColor = 'blue';
      this.offColor = 'yellow';
    }

    close() {
        this.modalRef.hide();
    }    

    sendAsset() {
      const data = {
        to: this.to,
        sendAmount: this.sendAmount
      };
      this.onClose.next(data);
      this.modalRef.hide();
    }

    onFlagChange(event) {
      console.log('event=', event);
      this.isAdvance = event;
    }


  }