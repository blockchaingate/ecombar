import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class DataService {

  private walletSource = new BehaviorSubject({});
  currentWallet = this.walletSource.asObservable();
  changeWallet(wallet: any) {
    this.walletSource.next(wallet);
  }  

  private walletAddressSource = new BehaviorSubject('');
  currentWalletAddress = this.walletAddressSource.asObservable();
  changeWalletAddress(address: string) {
    this.walletAddressSource.next(address);
  }  

  private storeSource = new BehaviorSubject({});
  currentStore = this.storeSource.asObservable();
  changeStore(store: any) {
    this.storeSource.next(store);
  }  

  constructor() { }



}