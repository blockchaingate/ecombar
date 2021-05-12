import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
    events: any;
    assets: any;
    
    constructor( 
        private coinServ: CoinService,
        private eventServ: NftEventService, 
        private utilServ: UtilService ) {}
    ngOnInit() {
        this.eventServ.getAll().subscribe(
            (ret: any) => {
                if(ret && ret.ok) {
                    const body = ret._body;
                    this.events = body.events;
                    this.assets = body.assets;
                }
                console.log('ret for events=', ret);
            }
        );
    }

    getIcon(event: string) {
        return this.utilServ.getIcon(event);
    }

    addressDisplay(address: string) {
        return this.utilServ.addressDisplay(address);
    }

    getCoinName(coinType: number) {
        return this.coinServ.getCoinNameByTypeId(coinType);
    }
    
    getName(smartContractAddress: string, tokenId: string) {
        const assets = this.assets.filter(item => item.smartContractAddress == smartContractAddress && item.tokenId == tokenId);
        if(assets && assets.length > 0) {
            return assets[0].name;
        }
        return '';
    }

    getImage(smartContractAddress: string, tokenId: string) {
        const assets = this.assets.filter(item => item.smartContractAddress == smartContractAddress && item.tokenId == tokenId);
        if(assets && assets.length > 0) {
            return assets[0].media;
        }
        return '';
    }    
  }