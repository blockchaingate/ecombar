import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { environment } from 'src/environments/environment';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/app/modules/shared/services/data.service';
// import { NgxSpinnerService } from "ngx-bootstrap-spinner";  // 只支持到 @angular/common@^10.0.0

@Component({
  selector: 'app-wallet-star-rewards',
  providers: [],
  templateUrl: './star-rewards.component.html',
  styleUrls: [
    './star-rewards.component.scss', 
    '../../../../../table.scss',
    '../../../../../page.scss'
  ]
})
export class StarRewardsComponent implements OnInit{
    @Input() rewards: any;
    wallet: any;
    reward: any;
    modalRef: BsModalRef;

    constructor(
      public kanbanServ: KanbanService,
      private dataServ: DataService,
      // private spinner: NgxSpinnerService,
      private kanbanSmartContractServ: KanbanSmartContractService,
      private modalService: BsModalService,   
      private toastr: ToastrService,   
      private utilServ: UtilService) {}
    ngOnInit() {
      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      ); 
    }

    showId(id: string) {
      return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }

    showAmount(amount: any) {
      return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
    }

    showReleaseTime(reward: any) {
      const releaseTime = reward.releaseTime;
      const thetime = new Date(releaseTime * 1000).toLocaleDateString("en-US");
      return thetime;
    }

    getTxidUrl(txid: string) {
      return environment.endpoints['website'] + 'explorer/tx-detail/' + txid; 
    }
    
    showStatus(status: number) {
      //0: refunded 1: valid   2:  request refund  3: redeemed
      if(status == 0) {
        return 'refunded';
      }
      if(status == 1) {
        return 'valid';
      }
      if(status == 2) {
        return 'request refund';
      }
      if(status == 3) {
        return 'redeemed';
      }
      return '';
    }
    


    showDetail(reward: any) {
      this
      let detail ='';
      for(let i = 0; i < reward.amount.length;i++) {
        const rewardAmount = reward.amount[i];
        const rewardCoinType = reward.coinType[i];
        if(rewardAmount > 0) {
          detail += this.showAmount(rewardAmount) + this.utilServ.getCoinNameByTypeId(rewardCoinType);
        }
        if(i != reward.amount.length - 1) {
          detail += '   '
        }
      }
      return detail;
    }

    redeemable(reward) {
      const timestamp = Math.floor(Date.now() / 1000);
      //console.log();
      if(reward.status == 1 && reward.releaseTime < timestamp) {
        return true;
      }
      return false;
    }

    redeem(reward) {
      this.reward = reward;
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
        // this.spinner.show();
        this.redeemDo(seed);
      });      
    }

    async redeemDo(seed: Buffer) {
      let address = this.reward.address;
      //address = '0x3a3bc5a481892291720de88c17e1b41ae6a6a3e1';
      const abi = {
        "constant": false,
        "inputs": [
          {
            "name": "_ID",
            "type": "bytes32"
          },
          {
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "releaseLocker",
        "outputs": [
          
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      };
      const args = [this.reward.id, this.utilServ.fabToExgAddress(this.reward.user)];

      const ret = await this.kanbanSmartContractServ.execSmartContract(seed, address, abi, args);
      // this.spinner.hide();
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        this.reward.status = 3;
        this.toastr.success('The reward was redeemed.');
      } else {
        this.toastr.error('Failed to redeem');
      }
    }
}