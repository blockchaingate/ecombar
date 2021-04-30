import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell-price',
    templateUrl: './asset-sell-price.component.html',
    styleUrls: ['./asset-sell-price.component.scss']
  })
  export class NftAssetSellPriceComponent implements OnInit {
    selectedCoin: string;
    showPopup: boolean;
    quantity: number;
    @Input() noText: boolean;
    @Output() updateEntity = new EventEmitter<any>();
    acceptableCoins = [
      'BTC',
      'ETH',
      'DUSD',
      'USDT',
      'FAB',
      'EXG',
      'BST',
      'DSC'
    ];
    
    ngOnInit() {
      this.showPopup = false;
      this.selectedCoin = 'DUSD';  
    }

    emitEntity() {
      this.updateEntity.emit(
        {
          coin: this.selectedCoin,
          quantity: this.quantity
        }
      );
    }

    select(coin: string) {
      this.selectedCoin = coin;
      this.showPopup = false;
      this.emitEntity()
    }

  }
