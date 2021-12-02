import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { IddockService } from 'src/app/modules/shared/services/iddock.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ABI, Bytecode } from '../../../../config/ecombar';
import { ABI as feeChargerABI, Bytecode as feeChargerBytecode } from '../../../../config/feeCharger';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { environment } from 'src/environments/environment';
import { StorageService } from 'src/app/modules/shared/services/storage.service';

@Component({
  selector: 'app-store',
  providers: [],
  templateUrl: './store.component.html',
  
})
export class StoreComponent implements OnInit {
  store: any;
  taxRate: number;
  name: string;
  images: any;
  hideOnStore: boolean;
  nameChinese: string;
  currentTab: string;
  giveAwayRate: number;
  feeChargerSmartContractAddress: string;
  smartContractAddress: string;
  refAddress: string;
  walletAddress: string;

  coin: string;
  id: string;
  modalRef: BsModalRef;
  wallet: any;
  address: string;
  objectId: string;

  coins = ['DUSD', 'USDT', 'DCAD', 'DCNY', 'DJPY', 'DGBP', 
  'DEURO', 'DAUD', 'DMYR', 'DKRW', 'DPHP', 
  'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR',
  'DMXN', 'DBRL', 'DNGN', 'BTC', 'ETH', 'FAB'];

  constructor(
    private coinServ: CoinService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private iddockServ: IddockService,
    private modalService: BsModalService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private router: Router,
    private dataServ: DataService,
    private storeageServ: StorageService,
    private storeServ: StoreService) {
  }

  initStore(store) {
    this.store = store;
    this.id = store._id;
    this.hideOnStore = store.hideOnStore;
    this.coin = store.coin;
    this.taxRate = store.taxRate;
    if(store.name) {
      this.name = store.name.en;
      this.nameChinese = store.name.sc;  
    }
    if(store.image) {
      this.images = [store.image];
    }
    this.feeChargerSmartContractAddress = store.feeChargerSmartContractAddress;     
    this.smartContractAddress = store.smartContractAddress; 
    this.refAddress = store.refAddress;
    this.giveAwayRate = store.giveAwayRate;
    this.objectId = store.objectId;   
  }
  ngOnInit() {
    this.hideOnStore = true;
    this.images = [];
    this.storeageServ.getStoreRef().subscribe(
      (refAddress: string) => {
        if(refAddress) {
          this.refAddress = refAddress;
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );
    this.dataServ.currentMyStore.subscribe(
      (store: any) => {
        console.log('store for subscribe=', store);
        if(store) {
          this.initStore(store);
        }
      }
    );
    this.currentTab = 'default';

    /*
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.storeServ.getStore(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const store = res._body;
            this.objectId = store.objectId;
            this.name = store.name.en;
            this.nameChinese = store.name.sc;
            this.taxRate = store.taxRate;
            this.smartContractAddress = store.smartContractAddress;
            this.coin = store.coin;
          }

        }
      );
    }
    */
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  async addStoreDo(seed: Buffer) {


    if(this.objectId) {
      const data: any = {
        name: {
          en: this.name,
          sc: this.nameChinese
        },
        taxRate: this.taxRate ? this.taxRate : 0,
        coin: this.coin,
        hideOnStore:this.hideOnStore
      };
      if(this.images && this.images.length > 0) {
        data.image = this.images[0];
      }
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      
      if(this.coin != this.store.coin) {
        const abi = {
          "inputs": [
            {
              "internalType": "uint32",
              "name": "_coinType",
              "type": "uint32"
            }
          ],
          "name": "changeCoinType",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        const args = [this.coinServ.getCoinTypeIdByName(this.coin)];
        const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, this.smartContractAddress, abi, args);
    

        if(!(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1')) {
          this.toastr.error('error while changing coin');
          this.spinner.hide();
          return;
        }
      }

      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;  

      this.storeServ.update(this.id, data).subscribe(
        async (res: any) => {
          if (res.ok) {
            (await this.iddockServ.updateIdDock(seed, this.objectId, 'things', null, data, null)).subscribe(res => {
              if(res) {
                if(res.ok) {
                  this.spinner.hide();
                  this.toastr.success('Store was updated.');
                }
              }
            });            
          }
        }
      ); 

    } else {

      const data: any = {
        name: {
          en: this.name,
          sc: this.nameChinese
        },
        coin: this.coin,
        giveAwayRate: this.giveAwayRate,
        taxRate: this.taxRate ? this.taxRate : 0,
        refAddress: this.refAddress,
        hideOnStore: this.hideOnStore
      };      
      if(!this.coin) {
        this.toastr.error('Coin not selected', 'Ok');
        this.spinner.hide();
        return;
      }
      if(this.images && this.images.length > 0) {
        data.image = this.images[0];
      }
      //const coinpoolAddress = await this.kanbanServ.getCoinPoolAddress();
      const proxyAddress = environment.addresses.smartContract.sevenStarProxy;
      let args2 = [
        proxyAddress,
        environment.addresses.smartContract.feeDistribution,
        this.utilServ.fabToExgAddress(this.walletAddress),
        this.utilServ.fabToExgAddress(this.refAddress),
        100-this.giveAwayRate,
        '0x1'
      ];
  
      const resp2 = await this.kanbanSmartContractServ.deploySmartContract(seed, feeChargerABI, feeChargerBytecode, args2);
  
  
      if(resp2 && resp2.ok && resp2._body && resp2._body.status == '0x1') {
        const body = resp2._body;
  
        const txid = body.transactionHash;
        this.kanbanSmartContractServ.getTransactionReceipt(txid).subscribe(
          async (receipt: any) => {
            if(receipt && receipt.transactionReceipt) {
              if(receipt.transactionReceipt.contractAddress) {
                const feeChargerSmartContractAddress = receipt.transactionReceipt.contractAddress;
                data.feeChargerSmartContractAddress = feeChargerSmartContractAddress;
                this.taxRate = 0;
                let args = [
                  feeChargerSmartContractAddress, 
                  this.coinServ.getCoinTypeIdByName(this.coin), 
                  this.taxRate];
                const resp = await this.kanbanSmartContractServ.deploySmartContract(seed, ABI, Bytecode, args);
            
                if(resp && resp.ok && resp._body && resp._body.status == '0x1') {
                  const body = resp._body;
            
                  const txid = body.transactionHash;
                  this.kanbanSmartContractServ.getTransactionReceipt(txid).subscribe(
                    async (receipt: any) => {
                      if(receipt && receipt.transactionReceipt) {
                        if(receipt.transactionReceipt.contractAddress) {
                          const smartContractAddress = receipt.transactionReceipt.contractAddress;
                          data.smartContractAddress = smartContractAddress;
                          const { datahash, sign, txhex } = await this.iddockServ.signIdDock(seed, 'things', null, data, null);
                          const newData = {
                            ...data,
                            datahash, 
                            sign,
                            txhex
                          };
                          this.storeServ.create(newData).subscribe(
                            (res: any) => {
                              console.log();
                              if (res && res.ok) {
                                //this.router.navigate(['/merchant/store']);
                                this.initStore(res._body);
                                this.smartContractAddress = smartContractAddress;
                                this.toastr.success('Store was created.');
                                this.spinner.hide();
                                //this.smartContractAddress = store.smartContractAddress;
                              }
                            }
                          );   
            
                        } else {
                          this.spinner.hide();
                          this.toastr.error('Error with creating smart contract.', 'Ok');
                        }
                      }
                    }
                  );
                }
                else {
                  this.spinner.hide();
                  this.toastr.error('Error with creating smart contract.', 'Ok');
                }
  
  
              }
            }
        });
      } else {
        this.spinner.hide();
        this.toastr.error('Error with creating smart contract.', 'Ok');
      }

    }
  }

  addStore() {
    if(this.refAddress == this.walletAddress) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    if(!this.refAddress) {
      this.toastr.info('Your referral code is empty.');
      return;      
    }
    let refAddressHex = '';
    try {
      refAddressHex = this.utilServ.fabToExgAddress(this.refAddress);

    } catch(e) {

    }
    if(!refAddressHex || (refAddressHex.length != 42)) {
      this.toastr.error('Your referral address is not in correct format.');
      return;        
    }

    if((this.giveAwayRate < 3) || (this.giveAwayRate >= 100) || !Number.isInteger(Number(this.giveAwayRate))) {
      this.toastr.info('Give away rate is incorrect. it must be a integer between 3 and 100.');
      return;         
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
      this.addStoreDo(seed);
    });

  }

  deleteStore() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
      this.spinner.show();
      this.deleteStoreDo(privateKey);
    });
  }

  deleteStoreDo(privateKey: any) {
    const data = {
      id: this.id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  

    this.storeServ.deleteStore(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          //this.router.navigate(['/merchant/store']);

          this.id = '';
          this.coin = '';
          this.taxRate = 0;
          this.name = '';
          this.nameChinese = '';  
          this.images = [];
          this.feeChargerSmartContractAddress = '';     
          this.smartContractAddress = ''; 
          this.refAddress = '';
          this.giveAwayRate = 0;
          this.objectId = '';   


          this.toastr.success('Store was deleted.');
          this.spinner.hide();
          //this.smartContractAddress = store.smartContractAddress;
        }
      }
    );  
  }
}
