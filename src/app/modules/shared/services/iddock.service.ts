import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Web3Service } from './web3.service';
import { UtilService } from './util.service';
import { KanbanService } from './kanban.service';

@Injectable({ providedIn: 'root' })
export class IddockService {
  constructor(
    private web3Serv: Web3Service,
    private kanbanServ: KanbanService,
    private utilServ: UtilService,
    private http: HttpService
    ) { }

   async getTxhex(keyPairsKanban, data: any) {
     const id = data._id;
    console.log('id=', id);
    const hash = data.datahash;
    console.log('hash=', hash);
    const abiHex = this.web3Serv.getAddRecordABI(id, hash);
   // const abiHex = this.web3Serv.getAddRecordABI('111', '222');
    const recordAddress = this.kanbanServ.getRecordAddress();
    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, recordAddress, nonce, 0, null);
    return txKanbanHex;
 
  }


  saveId(data: any) {
    const url = 'iddock/Create/id' ;  
    return this.http.post(url, data, false);   
  }
}

