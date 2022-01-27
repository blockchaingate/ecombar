import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrder } from '../../models/nft-order';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js/bignumber';
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
    @Input() sellOrder: any;
    @Output() refresh = new EventEmitter();

    showShareDropdown: boolean;
    constructor(private router: Router, private toastr: ToastrService, private utilServ: UtilService) {}
    ngOnInit() {
      this.showShareDropdown = false;        
    }

    onRefresh() {
      this.refresh.emit();
    }

    transfer() {
      this.router.navigate(['/nft/assets/' + this.asset.smartContractAddress + '/' + this.asset.tokenId + '/transfer'])
    }
    totalPrice() {
      return new BigNumber(this.sellOrder.amount).multipliedBy(this.sellOrder.basePrice).toNumber()
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
