import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService {

  private walletAddressSource = new BehaviorSubject('');
  currentWalletAddress = this.walletAddressSource.asObservable();
  changeWalletAddress(address: string) {
    this.walletAddressSource.next(address);
  }  

  constructor() { }



}