import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';


@Component({
  selector: 'app-wallet-assets-list',
  providers: [],
  templateUrl: './assets-list.component.html',
  styleUrls: [
    './assets-list.component.scss', 
    '../../../../../table.scss',
    '../../../../../page.scss'
  ]
})
export class AssetsListComponent implements OnInit{
    @Input() assets: any;
    @Output() withdraw = new EventEmitter<any>();

    constructor(public utilServ: UtilService) {}
    ngOnInit() {

    }

    getCoinNameByTypeId(coinType: any) {
        return this.utilServ.getCoinNameByTypeId(coinType);
    }

    showAmount(amount: any) {
        return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
    }
    withdrawDo(coinType) {
      this.withdraw.emit(coinType);
    }
}