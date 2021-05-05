import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrder } from '../../models/nft-order';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
    providers: [],
    selector: 'app-nft-asset-info',
    templateUrl: './asset-info.component.html',
    styleUrls: ['./asset-info.component.scss']
  })
  export class NftAssetInfoComponent implements OnInit {
    @Input() asset: any;
    @Input() collection: any;
    @Input() owner: string;
    @Input() address: string;
    @Output() refresh = new EventEmitter();
    sellOrder: NftOrder;

    showShareDropdown: boolean;
    constructor(private router: Router, private toastr: ToastrService, private utilServ: UtilService) {}
    ngOnInit() {
      this.showShareDropdown = false;
      if(this.asset) {
        console.log('this.asset=', this.asset);
        if(this.asset.orders && this.asset.orders.length > 0) {
          const sellOrders = this.asset.orders.filter(item => item.side == 1);
          console.log('sellOrders==', sellOrders);
          if(sellOrders && sellOrders.length > 0) {
            this.sellOrder = NftOrder.from(sellOrders[sellOrders.length - 1]);

            console.log('this.sellOrder=', this.sellOrder);
          }
          
        }        
      }         
    }

    onRefresh() {
      this.refresh.emit();
    }

    transfer() {
      this.router.navigate(['/nft/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId + '/transfer'])
    }
    
    copyLink() {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = window.location.href;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.toastr.info('Link copied');
    }
    
    getCoinName(coinType: number) {
      return this.utilServ.getCoinNameByTypeId(coinType);
    }
  }
