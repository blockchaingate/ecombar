import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Pipe({name: 'assetsSearch'})
export class AssetsSearchPipe implements PipeTransform {
  constructor(private utilServ: UtilService) {}
  transform(value: any, collectionsLength: number, coinsLength: number, collections?: any, coins?: any): any {
    if(!collections && !coins) {
        return value;
    }
    if(collections && collections.length > 0) {
        const smartContractAddresses = collections.map(item => item.smartContractAddress);
        value = value.filter(item => smartContractAddresses.indexOf(item.smartContractAddress) >= 0);
    }

    if(coins && coins.length > 0) {
      value = value.filter(item => item.sellOrder && coins.indexOf(this.utilServ.getCoinNameByTypeId(item.sellOrder.coinType)) >= 0);
    }

    return value;
  }
}