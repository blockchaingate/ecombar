import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-fee-distribution-update-reward-percentages',
  templateUrl: './fee-distribution-update-reward-percentages.component.html',
  styleUrls: ['./fee-distribution-update-reward-percentages.component.css']
})
export class FeeDistributionUpdateRewardPercentagesComponent implements OnInit {
  modalRef: BsModalRef;
  to: string;
  walletAddress: string;
  owner: string;
  wallet: any;
  percentage1: number;
  percentage2: number;
  percentage3: number;  
  percentage4: number;  
  percentage5: number;  
  percentage6: number;  
  percentage7: number;  
  percentage8: number;  
  percentage9: number;  
  percentage10: number;  
  percentage11: number; 
  percentage12: number;  
  percentage13: number;  
  percentage14: number;  

  constructor(
    private dataServ: DataService,
    private spinner: NgxSpinnerService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private web3Serv: Web3Service,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.to = environment.addresses.smartContract.feeDistribution;
    this.checkOwner();
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    ); 
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.route.queryParamMap.subscribe(
      (map: any) => {
        const params = map.params;
        this.percentage1 = params.percentage1;
        this.percentage2 = params.percentage2;
        this.percentage3 = params.percentage3;
        this.percentage4 = params.percentage4;
        this.percentage5 = params.percentage5;
        this.percentage6 = params.percentage6;
        this.percentage7 = params.percentage7;
        this.percentage8 = params.percentage8;
        this.percentage9 = params.percentage9;
        this.percentage10 = params.percentage10;
        this.percentage11 = params.percentage11;
        this.percentage12 = params.percentage12;
        this.percentage13 = params.percentage13;
        this.percentage14 = params.percentage14;
      }
    )
  }

  checkOwner() {
    const abi = {
      "constant": true,
      "inputs": [
        
      ],
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
    };
    const args = [];
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
    this.kanbanServ.kanbanCall(this.to, abiData).subscribe(
      (ret: any) => {
        const kanbanAddress = '0x' + ret.data.substring(ret.data.length - 40);
        this.owner = this.utilServ.exgToFabAddress(kanbanAddress);
      }
    );
  }  

  update() {
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
      this.updateDo(seed);
    });
  }

  async updateDo(seed: Buffer) {
    
    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "_percents",
          "type": "uint256[14]"
        },
        {
          "name": "_decimal",
          "type": "uint256"
        }
      ],
      "name": "updateRewardPercent",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [[
      this.percentage1,
      this.percentage2,
      this.percentage3,
      this.percentage4,
      this.percentage5,
      this.percentage6,
      this.percentage7,
      this.percentage8,
      this.percentage9,
      this.percentage10,
      this.percentage11,
      this.percentage12,
      this.percentage13,
      this.percentage14
    ], 10000];
    console.log('args for updateRewardPercent==', args);
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.to, abi, args);
    this.spinner.hide();
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('reward percentages was updated successfully');
      this.router.navigate(['/admin/fee-distribution']);
    } else {
      this.toastr.error('Error while updating reward coin');
    }
  }
}
