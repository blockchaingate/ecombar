import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { StoreService } from '../../../shared/services/store.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-store-approve',
  templateUrl: './store-approve.component.html',
  styleUrls: ['./store-approve.component.scss']
})
export class StoreApproveComponent implements OnInit {
  coinpoolAddress: string;
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
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private storeServ: StoreService) { }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
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


            this.coinpoolAddress = await this.kanbanServ.getCoinPoolAddress();
            console.log('coinpoolAddress==', this.coinpoolAddress);
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
            const ret2 = await this.kanbanServ.kanbanCallAsync(this.coinpoolAddress, abi);  
            const coinpoolOwnerAddress = this.utilServ.exgToFabAddress('0x' + ret2.data.substring(ret2.data.length - 40)); 

            this.dataServ.currentWalletAddress.subscribe(
              (walletAddress: string) => {
                if(walletAddress == coinpoolOwnerAddress) {
                  this.isCoinPoolOwner = true;
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
      this.spinner.show();
      this.approveDo(seed);
    });
  }


async approveDo(seed: Buffer) {
  try {

  
  const randomString = this.utilServ.getRandomInteger();
  console.log('randomString===', randomString);
    const argsAddContract = [
      this.store.feeChargerSmartContractAddress,
      100,
      randomString
    ];
    const abiAddContract = {
      "constant": false,
      "inputs": [
        {
          "name": "_contractAddr",
          "type": "address"
        },
        {
          "name": "_activatedAt",
          "type": "uint256"
        },
        {
          "name": "_accountType",
          "type": "uint32"
        }
      ],
      "name": "addContract",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.coinpoolAddress, abiAddContract, argsAddContract);
    

    const argsToWhiteList = [
      this.store.feeChargerSmartContractAddress
    ];
    const abiToWhiteList = {
      "constant": false,
      "inputs": [
        {
          "name": "_operator",
          "type": "address"
        }
      ],
      "name": "addToWhiteList",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, this.coinpoolAddress, abiToWhiteList, argsToWhiteList);
    console.log('ret2=', ret2);    
    
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

      const ret3 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.feeDistribution, abiRegisterFeeCharger, argsRegisterFeeCharger);
      
      if(ret3 && ret3.ok && ret3._body && ret3._body.status == '0x1') {
        this.storeServ.update(this.store._id, {status: 1}).subscribe(
          (ret: any) => {
            this.spinner.hide();
            if(ret && ret.ok) {
              this.toastr.success('the store was approved.');
              this.router.navigate(['/admin/stores']);
            }
          }
        );
      } else {
        this.toastr.error('Failed to registerFeeCharger.');
        this.spinner.hide();
      }


      
    } else {
      this.toastr.error('Failed to approve the store.');
    }
  } catch(e) {
    this.spinner.hide();
  }
  }
}
