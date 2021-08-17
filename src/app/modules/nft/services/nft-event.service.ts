import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';

@Injectable({ providedIn: 'root' })
export class NftEventService {

  constructor(
    private http: HttpClient) { }

    getAll() {
        const url = environment.endpoints.blockchaingate + 'nft-event';
        return this.http.get(url);           
    }

    getAllByAddress(address: string) {
        const url = environment.endpoints.blockchaingate + 'nft-event/address/' 
        + address;
        return this.http.get(url);  
    }

    getBySmartContractTokenId(smartContractAddress: string, tokenId: string) {
        const url = environment.endpoints.blockchaingate + 'nft-event/smartContractAddressTokenId/' 
        + smartContractAddress + '/' + tokenId;
        return this.http.get(url);      
    }    
}