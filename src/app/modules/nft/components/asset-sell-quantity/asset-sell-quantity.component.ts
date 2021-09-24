import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-quantity',
    templateUrl: './asset-sell-quantity.component.html',
    styleUrls: ['./asset-sell-quantity.component.scss']
  })
  export class NftAssetSellQuantityComponent implements OnInit {
    showPopup: boolean;
    quantity: number;
    @Input() noText: boolean;
    @Output() updateQuantity = new EventEmitter<any>();

    constructor(private utilServ: UtilService) {

    }
    
    ngOnInit() {
      this.showPopup = false;
    }

    emitEntity() {
      this.updateQuantity.emit(
        {
          quantity: this.quantity
        }
      );
    }


  }
