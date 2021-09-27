import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftEventService } from '../../services/nft-event.service';

@Component({
    providers: [],
    selector: 'app-nft-activities',
    templateUrl: './activities.component.html',
    styleUrls: ['./activities.component.scss']
  })
  export class NftActivitiesComponent implements OnInit {
    @Input() events: any;
    @Input() selectedEventTypes: any;
    @Input() selectedCollections: any;
    constructor( 
        private coinServ: CoinService,
        private eventServ: NftEventService, 
        private utilServ: UtilService ) {}
    ngOnInit() {

    }

    getIcon(event: string) {
        return this.utilServ.getIcon(event);
    }

    addressDisplay(address: string) {
        return this.utilServ.addressDisplay(address);
    }

    getFrom(address: string) {
        if(!address) {
            return address;
        }
        if(address.indexOf('0x') == 0) {
            return this.utilServ.exgToFabAddress(address);
        }
        return address;
    }
    getCoinName(coinType: number) {
        return this.coinServ.getCoinNameByTypeId(coinType);
    }
    

  }