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
  
  private storeIdSource = new BehaviorSubject('');
  currentStoreId = this.storeIdSource.asObservable();
  changeStoreId(storeId: string) {
    this.storeIdSource.next(storeId);
  }  

  private storeOwnerSource = new BehaviorSubject('');
  currentStoreOwner = this.storeOwnerSource.asObservable();
  changeStoreOwner(owner: string) {
    this.storeOwnerSource.next(owner);
  }  
  
  private myStoreSource = new BehaviorSubject({});
  currentMyStore = this.myStoreSource.asObservable();
  changeMyStore(store: any) {
    this.myStoreSource.next(store);
  }  



  constructor() { }



}