
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PaycoolService } from 'src/app/modules/shared/services/paycool.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { Router } from '@angular/router';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';

// import { StoreList, StoreListHot, StoreListNew } from './mock-stores';    // 虚拟商家数据（测试）

@Component({
  selector: 'app-stores-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class StoresIndexComponent implements OnInit {
  stores: any;    // 商家列表
  storesHot: any;    // 热门推荐
  storesNew: any;    // 最新入驻
  wallet: any;
  parentId: string;
  pageNum: number = 0;
  pageSize: number = 10;
  walletAddress: string;
  modalRef: BsModalRef;
  isValidMember: boolean;

  constructor(
    private dataServ: DataService,
    private paycoolServ: PaycoolService,
    private storeageServ: StorageService,
    private toastr: ToastrService,
    private router: Router,
    private utilServ: UtilService,
    public kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    console.log('stores here we go');
    this.storeageServ.getStoreRef().subscribe(
      (refAddress: any) => {
        this.parentId = refAddress;
      }
    );

    this.isValidMember = true;
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.walletAddress = walletAddress;
          this.paycoolServ.isValidMember(walletAddress).subscribe(
            (ret: any) => {
              this.isValidMember = ret.isValid;
            }
          );
        }
      }
    );

    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    );
    this.storeServ.getStoresInEcombar(this.pageSize, this.pageNum).subscribe(    // 获取“商家列表”
      (ret: any) => {
        console.log('ret==', ret);

        // this.stores = StoreList;    // 虚拟商家数据（测试）
        this.stores = ret;
      }
    );
    this.storeServ.queryHotlist().subscribe(    // 获取“热门推荐”
      (ret: any) => {
        console.log('ret==', ret);

        // this.storesHot = StoreListHot;    // 虚拟商家数据（测试）
        this.storesHot = ret;
      }
    );
    this.storeServ.queryNewlist().subscribe(    // 获取“最新入驻”
      (ret: any) => {
        console.log('ret==', ret);

        // this.storesNew = StoreListNew;    // 虚拟商家数据（测试）
        this.storesNew = ret;
      }
    );
  }

  joinAsMember() {
    this.paycoolServ.isValidMember(this.parentId).subscribe(
      (ret: any) => {
        if((ret && ret.isValid) || (this.parentId == environment['addresses'].Referral_ROOT)) {
          const initialState = {
            pwdHash: this.wallet.pwdHash,
            gas: 0,
            encryptedSeed: this.wallet.encryptedSeed
          };          
          
          this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
          this.modalRef.content.onClose.subscribe ((seed: any) => {
            this.joinAsMemberDo(seed);
          }); 
        } else {
          this.toastr.error('Invalid referral code.');
        }
      }
    );

   
  }

  async joinAsMemberDo(seed: any) {
    /*
    const data = {
      parentId: this.parentId
    };
    */
    if(this.parentId == this.walletAddress) {
      this.toastr.info('You cannot refer yourself.');
      return;
    }
    /*
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature; 
    this.starServ.createRef(data).subscribe(
      (ret: any) => {
        if(ret && ret._id) {
          this.isValidMember = true;
        }
      }
    );  
    */

    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_referral",
          "type": "address"
        }
      ],
      "name": "createAccount",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const hexAddress = this.utilServ.fabToExgAddress(this.parentId);
    const args = [hexAddress];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, environment['addresses'].smartContract.smartConractAdressReferral, abi, args);
    console.log('ret====');
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('Your request was made successfully');
    } else {
      this.toastr.error('Failed to join');
    }
  }

  // 跳转商家页面
  gotoStore(store) {
    this.router.navigate(['/store/' + store._id + '/no/-1']);    // 台号 -1，缺省网店 
  }

  // 重新刷新列表
  moreStore() {

    this.storeServ.getStoresInEcombar(this.pageSize, ++this.pageNum).subscribe(    // 获取“商家列表”
    (ret: any) => {
      
      if(ret && ret.length > 0) {
        this.stores = this.stores.concat(ret);
      }
      
    }
  );
    //this.stores = StoreListNew;    // 虚拟商家数据（测试）
    // this.storesHot = StoreListHot;    // 虚拟商家数据（测试）
    // this.storesNew = StoreListNew;    // 虚拟商家数据（测试）
  }
}
