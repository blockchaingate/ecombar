import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
// import { NgxSpinnerService } from 'ngx-bootstrap-spinner';  // 只支持到 @angular/common@^10.0.0
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-approve',
  templateUrl: './store-approve.component.html',
  styleUrls: ['./store-approve.component.scss']
})
export class StoreApproveComponent implements OnInit {
  proxyAddress: string;
  isCoinPoolOwner: boolean;
  modalRef: BsModalRef;
  wallet: any;
  store: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    private utilServ: UtilService,
    private dataServ: DataService,
    // private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private storeServ: StoreService) { }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.isCoinPoolOwner = false;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.storeServ.getStore(id).subscribe(
        async (ret: any) => {
          if(ret && ret.ok) {
            this.store = ret._body;


            
            this.proxyAddress = environment['addresses'].smartContract.sevenStarProxy;
            const abi = this.web3Serv.getGeneralFunctionABI(
              {
                "constant": true,
                "inputs": [],
                "name": "owner",
                "outputs": [
                  {
                    "name": "",
                    "type": "address"
                  }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
              },[]
            );
            const ret2 = await this.kanbanServ.kanbanCallAsync(this.proxyAddress, abi);  
            const proxyOwnerAddress = this.utilServ.exgToFabAddress('0x' + ret2.data.substring(ret2.data.length - 40)); 

            this.dataServ.currentWalletAddress.subscribe(
              async (walletAddress: string) => {
                if(walletAddress == proxyOwnerAddress) {

                  const ret3 = await this.kanbanServ.kanbanCallAsync(this.proxyAddress, abi);  
                  const feeDistributionOwnerAddress = this.utilServ.exgToFabAddress('0x' + ret3.data.substring(ret2.data.length - 40)); 
                  if(feeDistributionOwnerAddress == walletAddress) {
                    this.isCoinPoolOwner = true;
                  }
                }
              }
            );
            
          }
        }
      );
    }
  }

  approve() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      // this.spinner.show();
      this.approveDo(seed);
    });
  }


async approveDo(seed: Buffer) {
  try {

    const argsAddContract = [
      this.store.feeChargerSmartContractAddress
    ];
    const abiAddContract = {
      "constant": false,
      "inputs": [
        {
          "name": "_merchantContract",
          "type": "address"
        }
      ],
      "name": "registerMerchant",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, this.proxyAddress, abiAddContract, argsAddContract);
    

    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {


      const argsRegisterFeeCharger = [this.store.feeChargerSmartContractAddress];
      const abiRegisterFeeCharger = {
        "constant": false,
        "inputs": [
          {
            "name": "_contractAddr",
            "type": "address"
          }
        ],
        "name": "registerFeeCharger",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      };

      const ret3 = await this.kanbanSmartContractServ.execSmartContract(seed, environment['addresses'].smartContract.feeDistribution, abiRegisterFeeCharger, argsRegisterFeeCharger);
      
      if(ret3 && ret3.ok && ret3._body && ret3._body.status == '0x1') {
        this.storeServ.update(this.store._id, {status: 1}).subscribe(
          (ret: any) => {
            // this.spinner.hide();
            if(ret && ret.ok) {
              this.toastr.success('the store was approved.');
              this.router.navigate(['/admin/stores']);
            } else {
              this.toastr.error('Failed to save the store.');
            }
          }
        );
      } else {
        this.toastr.error('Failed to registerFeeCharger.');
        // this.spinner.hide();
      }


      
    } else {
      this.toastr.error('Failed to registerMerchant.');
    }
  } catch(e) {
    // this.spinner.hide();
  }
  }
}
