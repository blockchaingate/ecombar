import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Web3Service } from './web3.service';
import { UtilService } from './util.service';
import { CoinService } from './coin.service';
import { KanbanService } from './kanban.service';

@Injectable({ providedIn: 'root' })
export class IddockService {
  constructor(
    private web3Serv: Web3Service,
    private kanbanServ: KanbanService,
    private utilServ: UtilService,
    private coinServ: CoinService,
    private http: HttpService
    ) { }

    getTypeId(type: string) {
      if(type == 'people') {
        return 0;
      } else 
      if(type == 'organization') {
        return 1;
      }
      return 2;
    }

   async getAddTxhex(keyPairsKanban, type: string, data: any) {

    const hash = data.datahash;
    const typeId = this.getTypeId(type);

    const abiHex = this.web3Serv.getCreateIDABI(typeId, hash);

    const recordAddress = await this.kanbanServ.getRecordAddress();
    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, recordAddress, nonce, 0, null);
    return txKanbanHex;
 
  }

  async getUpdateTxhex(keyPairsKanban, id: string, type: string, data: any) {

    const hash = data.datahash;

    const abiHex = this.web3Serv.getUpdateIDABI(id, hash);

    const recordAddress = await this.kanbanServ.getRecordAddress();
    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, recordAddress, nonce, 0, null);
    return txKanbanHex;
 
  }

  async getChangeOwnerTxhex(keyPairsKanban, id: string, newOwner: string) {

    const abiHex = this.web3Serv.getChangeOwnerABI(id, newOwner);

    const recordAddress = await this.kanbanServ.getRecordAddress();
    const nonce = await this.kanbanServ.getTransactionCount(this.utilServ.fabToExgAddress(keyPairsKanban.address));
    const txKanbanHex = await this.web3Serv.signAbiHexWithPrivateKey(abiHex, keyPairsKanban, recordAddress, nonce, 0, null);
    return txKanbanHex;
 
  }
  saveDock(type: string, data: any) {
    const url = 'iddock/Create/' + type;  
    return this.http.post(url, data, false);   
  }

  updateDock(type: string, id: string, data: any) {
    const url = 'iddock/Update/' + type + '/' + id;  
    return this.http.post(url, data, false);   
  }  
  
  updateOwner(type: string, id: string, data: any) {
    const url = 'iddock/ChangeOwner/' + type + '/' + id;  
    return this.http.post(url, data, false);   
  }  

  findAll(type: string, id: string) {
    const url = 'iddock/findById/' + type + '/' + id;
    return this.http.get(url, false);
  }
  
  getHashByAccount(owner: string, id: string) {
    const url = 'iddock/getDetailBySequenceID/' + owner + '/' + id;
    return this.http.get(url, false);
  }
   
  getDetail(type: string, id: string) {
    if(!type) {
      type = 'people';
    }
    const url = 'iddock/getDetail/' + type + '/' + id;
    console.log('url=', url);
    return this.http.get(url, false);
  }

  getHistory(type: string, id: string) {
    if(!type) {
      type = 'people';
    }
    const url = 'iddock/getHistory/' + type + '/' + id;
    return this.http.get(url, false);
  }

  async getNonce(type: string, id: string) {
    const url = 'iddock/getNonce/' + type + '/' + id;
    console.log('url for getNonce=', url);
    const ret = await this.http.get(url, false).toPromise();
    if(ret && ret.ok) {
      return ret._body;
    }
    return -1;
  } 

  async changeOwnerBySequence(seed, sequence: string, type: string, rfid: string, nvs: any, parents: any, owner: string) {

    let nvsString = JSON.stringify(nvs);
    if(type == 'organization' || type == 'things') {
      nvsString = 'rfid=' + rfid + '&' + nvsString;
    }
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');   
    
    const selfSign = this.coinServ.signedMessage(nvsString, keyPairsKanban);
    const selfSignString = this.utilServ.stripHexPrefix(selfSign.r)  + this.utilServ.stripHexPrefix(selfSign.s) + this.utilServ.stripHexPrefix(selfSign.v);
    const datahash = this.web3Serv.getHash(nvsString);

    const data = {
        _id: sequence,
        selfSign: selfSignString,
        transferSig: null,
        owner: null,
        previousOwner: null,
        rfid: null,
        nvs: nvs,
        parents: parents,
        datahash: datahash,
        txhex: ''
    };

    if(type == 'organization' || type == 'things') {
      data.previousOwner = keyPairsKanban.address;
      data.owner = owner;
      data.rfid = rfid;
      data.selfSign = null;
      data.transferSig = selfSignString;
    }
    
    const txhex = await this.getAddTxhex(keyPairsKanban, type,  data);
    data.txhex = txhex;
    return this.saveDock(type, data);    
  }

  async saveIdDockBySequence(seed, sequence: string, type: string, rfid: string, nvs: any, parents: any) {
    let nvsString = JSON.stringify(nvs);
    if(type == 'organization' || type == 'things') {
      nvsString = 'rfid=' + rfid + '&' + nvsString;
    }
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');   
    
    const selfSign = this.coinServ.signedMessage(nvsString, keyPairsKanban);
    const selfSignString = this.utilServ.stripHexPrefix(selfSign.r)  + this.utilServ.stripHexPrefix(selfSign.s) + this.utilServ.stripHexPrefix(selfSign.v);
    const datahash = this.web3Serv.getHash(nvsString);

    const data = {
        _id: sequence,
        selfSign: selfSignString,
        transferSig: null,
        owner: null,
        rfid: null,
        nvs: nvs,
        parents: null,
        datahash: datahash,
        txhex: ''
    }

    if(type == 'organization' || type == 'things') {
      data.owner = keyPairsKanban.address;
      data.rfid = rfid;
      data.selfSign = null;
      data.transferSig = selfSignString;
      data.parents = parents
    }
    
    const txhex = await this.getAddTxhex(keyPairsKanban, type, data);
    data.txhex = txhex;
    return this.saveDock(type, data);

  }
  async saveIdDock(seed, id: string, type: string, rfid: string, nvs: any, parents: any, nonce: number) {

    const hexString = nonce.toString(16);
    id = (type == 'people' ? this.utilServ.fabToExgAddress(id) : this.web3Serv.sha3(id).substring(0, 42)) + hexString;

    return await this.saveIdDockBySequence(seed, id, type, rfid, nvs, parents);


  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj
  }

  getHashSign(keyPair, data: any) {
    const obj = this.clean(data);
    let nvsString = JSON.stringify(obj);

    const selfSign = this.coinServ.signedMessage(nvsString, keyPair);
    const sign = this.utilServ.stripHexPrefix(selfSign.r)  + this.utilServ.stripHexPrefix(selfSign.s) + this.utilServ.stripHexPrefix(selfSign.v);
    const datahash = this.web3Serv.getHash(nvsString);    

    return [datahash, sign];
  }


  async addIdDock(seed, type: string, rfid: string, nvs: any, parents: any) {
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b'); 

    const newNvs = [];
    if(typeof nvs === 'object') {
      for (const [key, value] of Object.entries(nvs)) {
        newNvs.push( {
          name: key,
          value: value
        }
        );
      }
    }

    const data = {
      _id: null,
      owner: null,
      sign: null,
      rfid: null,
      parents: null,
      nvs: (newNvs && newNvs.length > 0) ? newNvs : nvs,
      dateCreated: new Date().toISOString(),
      lastUpdated: null,
      datahash: null,
      txhex: null,
    };

    if(type != 'people') {
      data.rfid = rfid;
      data.parents = parents;
    }    

    const [datahash, sign] = this.getHashSign(keyPairsKanban, data);
    if(type != 'people') {
      data.owner = keyPairsKanban.address;
    }
    data.datahash = datahash;
    data.sign = sign;

    const txhex = await this.getAddTxhex(keyPairsKanban, type, data);
    data.txhex = txhex;

    return this.saveDock(type, data); 
  }

  async updateIdDock(seed, id: string, type: string, rfid: string, nvs: any, parents: any) {
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b'); 

    const newNvs = [];
    if(typeof nvs === 'object') {
      for (const [key, value] of Object.entries(nvs)) {
        newNvs.push( {
          name: key,
          value: value
        }
        );
      }
    }

    const data = {
      _id: null,
      sign: null,
      rfid: null,
      parents: null,
      nvs: (newNvs && newNvs.length > 0) ? newNvs : nvs,
      dateCreated: new Date().toISOString(),
      lastUpdated: null,
      datahash: null,
      txhex: null,
    };

    if(type != 'people') {
      data.rfid = rfid;
      data.parents = parents;
    }    

    const [datahash, sign] = this.getHashSign(keyPairsKanban, data);
    data.datahash = datahash;
    data.sign = sign;

    const txhex = await this.getUpdateTxhex(keyPairsKanban,id, type, data);
    data.txhex = txhex;

    return this.updateDock(type, id, data);     
  }

  async changeOwner(seed, id: string, type: string, newOwner: string) {
    const keyPairsKanban = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b'); 

    const txhex = await this.getChangeOwnerTxhex(keyPairsKanban,id, newOwner);
    const data = {
      newOwner: newOwner,
      txhex: txhex
    };
    
    return this.updateOwner(type, id, data);        
  }
}

