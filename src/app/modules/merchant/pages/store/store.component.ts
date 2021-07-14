import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../shared/services/store.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { IddockService } from '../../../shared/services/iddock.service';
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

@Component({
  selector: 'app-store',
  providers: [],
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class StoreComponent implements OnInit {
  taxRate: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  feeChargerSmartContractAddress: string;
  smartContractAddress: string;
  walletAddress: string;

  coin: string;
  id: string;
  modalRef: BsModalRef;
  wallet: any;
  address: string;
  objectId: string;

  coins = ['DUSD', 'USDT'];

  constructor(
    private localSt: LocalStorage,
    private route: ActivatedRoute,
    private coinServ: CoinService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private iddockServ: IddockService,
    private modalService: BsModalService,
    private kanbanSmartContract: KanbanSmartContractService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private dataServ: DataService,
    private storeServ: StoreService) {
  }

  ngOnInit() {
    //this.feeChargerSmartContractAddress = environment.addresses.smartContract.FEE_CHARGER;

    /*
    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if(!wallets || !wallets.items || (wallets.items.length == 0)) {
        return;
      }
      const wallet = wallets.items[wallets.currentIndex];
      this.wallet = wallet;
      const addresses = wallet.addresses;
      this.address = addresses.filter(item => item.name == 'FAB')[0].address;  
      this.storeServ.getStoresByAddress(this.address).subscribe(
        (ret: any) => {
          console.log('ret for store==', ret);
          if(ret && ret.ok && ret._body && ret._body.length > 0) {
            const store = ret._body[ret._body.length - 1];
            console.log('store==', store);
            this.coin = store.coin;
            this.taxRate = store.taxRate;
            this.name = store.name.en;
            this.nameChinese = store.name.sc;
          }
        }
      );    
    });
    */
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
    this.dataServ.currentStore.subscribe(
      (store: any) => {
        console.log('store for subscribe=', store);
        if(store) {
          this.id = store._id;
          this.coin = store.coin;
          this.taxRate = store.taxRate;
          if(store.name) {
            this.name = store.name.en;
            this.nameChinese = store.name.sc;  
          }

          this.feeChargerSmartContractAddress = store.feeChargerSmartContractAddress;     
          this.smartContractAddress = store.smartContractAddress; 
          this.objectId = store.objectId;  
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
        }
      };
      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const privateKey = keyPair.privateKeyBuffer.privateKey;
      
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
        taxRate: this.taxRate ? this.taxRate : 0
      };      
      const coinpoolAddress = await this.kanbanServ.getCoinPoolAddress();
      let args2 = [
        coinpoolAddress,
        environment.addresses.exchangilyRecipient,
        this.utilServ.fabToExgAddress(this.walletAddress),
        70,
        '0x33'
      ];
  
      const resp2 = await this.kanbanSmartContract.deploySmartContract(seed, feeChargerABI, feeChargerBytecode, args2);
  
  
      if(resp2 && resp2.ok && resp2._body && resp2._body.status == '0x1') {
        const body = resp2._body;
  
        const txid = body.transactionHash;
        this.kanbanSmartContract.getTransactionReceipt(txid).subscribe(
          async (receipt: any) => {
            if(receipt && receipt.transactionReceipt) {
              if(receipt.transactionReceipt.contractAddress) {
                const feeChargerSmartContractAddress = receipt.transactionReceipt.contractAddress;
                data.feeChargerSmartContractAddress = feeChargerSmartContractAddress;
                let args = [
                  feeChargerSmartContractAddress, 
                  this.coinServ.getCoinTypeIdByName(this.coin), 
                  this.taxRate];
                const resp = await this.kanbanSmartContract.deploySmartContract(seed, ABI, Bytecode, args);
            
                if(resp && resp.ok && resp._body && resp._body.status == '0x1') {
                  const body = resp._body;
            
                  const txid = body.transactionHash;
                  this.kanbanSmartContract.getTransactionReceipt(txid).subscribe(
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

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( (seed: Buffer) => {
      this.spinner.show();
      this.addStoreDo(seed);
    });

  }
}
