import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Pipe({name: 'eventsSearch'})
export class EventsSearchPipe implements PipeTransform {
  constructor(private utilServ: UtilService) {}
  transform(value: any, collectionsLength: number, eventTypesLength: number, collections?: any, eventTypes?: any): any {
    if(!collections && !eventTypes) {
        return value;
    }
    if(collections && collections.length > 0) {
        const smartContractAddresses = collections.map(item => item.smartContractAddress);
        value = value.filter(item => smartContractAddresses.indexOf(item.smartContractAddress) >= 0);
    }

    if(eventTypes && eventTypes.length > 0) {
      value = value.filter(item => eventTypes.indexOf(item.name) >= 0);
    }

    return value;
  }
}