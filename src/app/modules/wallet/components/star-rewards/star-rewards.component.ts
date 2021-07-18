import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-wallet-star-rewards',
  providers: [],
  templateUrl: './star-rewards.component.html',
  styleUrls: ['./star-rewards.component.scss', '../../../../../table.scss']
})
export class StarRewardsComponent implements OnInit{
    @Input() rewards: any;

    constructor(private utilServ: UtilService) {}
    ngOnInit() {

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
      return environment.endpoints.website + 'explorer/tx-detail/' + txid; 
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
}