import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-fee-distribution',
  templateUrl: './fee-distribution.component.html',
  styleUrls: ['./fee-distribution.component.css', '../../../../../table.scss']
})
export class FeeDistributionComponent implements OnInit {
  to: string;
  rewardCoins: any;
  rewardPercentages: any;
  coin1: string;
  coin2: string;
  coin3: string;
  percentage1: number;
  percentage2: number;
  percentage3: number;

  rewardPercentage1: number;
  rewardPercentage2: number;
  rewardPercentage3: number;
  rewardPercentage4: number;
  rewardPercentage5: number;
  rewardPercentage6: number;
  rewardPercentage7: number;
  rewardPercentage8: number;
  rewardPercentage9: number;
  rewardPercentage10: number;
  rewardPercentage11: number;

  constructor(
    private utilServ: UtilService,
    private web3Serv: Web3Service,
    private router: Router,
    private kanbanServ: KanbanService) { }

  ngOnInit(): void {
    this.rewardCoins = [];
    this.rewardPercentages = [];
    this.to = environment.addresses.smartContract.feeDistribution;
    this.getRewardTokens();
    this.getRewardPercentages();
  }

  getRewardTokens() {
    const abi = {
      "constant": true,
      "inputs": [
        
      ],
      "name": "getTokensAndPercent",
      "outputs": [
        {
          "name": "_tokens",
          "type": "uint32[]"
        },
        {
          "name": "_tokenPercents",
          "type": "uint256[]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, []);
    this.kanbanServ.kanbanCall(this.to, abiData).subscribe(
      (ret: any) => {
        const data = ret.data;
        const decoded = this.web3Serv.decodeData(['uint32[]', 'uint256[]'],data);
        const tokens = decoded[0];
        const tokenPercents = decoded[1];
        for(let i = 0; i < tokens.length; i++) {
          if(i == 0) {
            this.coin1 = this.utilServ.getCoinNameByTypeId(Number(tokens[i]));
            this.percentage1 = tokenPercents[i];
          } else
          if(i == 1) {
            this.coin2 = this.utilServ.getCoinNameByTypeId(Number(tokens[i]));
            this.percentage2 = tokenPercents[i];           
          } else
          if(i == 2) {
            this.coin3 = this.utilServ.getCoinNameByTypeId(Number(tokens[i]));
            this.percentage3 = tokenPercents[i];
          }
          this.rewardCoins.push({
            name: this.utilServ.getCoinNameByTypeId(Number(tokens[i])),
            percentage: tokenPercents[i]
          });
        }


      }
    );
    
  }

  getRewardName(i) {
    let name = '';
    if(i == 0) {
      name = 'customer';
    } else 
    if(i == 1) {
      name = "merchant"
    } else 
    if(i == 2) {
      name = "merchant's referral"
    } else {
      name = "lv " + (i - 2)
    }
    return name;
  }

  getRewardPercentages() {
    const abi = {
      "constant": true,
      "inputs": [],
      "name": "getRewardPercent",
      "outputs": [
        {
          "name": "",
          "type": "uint256[11]"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, []);
    this.kanbanServ.kanbanCall(this.to, abiData).subscribe(
      (ret: any) => {
        const data = ret.data;
        const decoded = this.web3Serv.decodeData(['uint256[11]'],data)[0];
        console.log('decoded for getRewardPercent=', decoded);
        for(let i = 0; i < decoded.length; i++) {
          if(i == 0) {
            this.rewardPercentage1 = decoded[i];
          } else
          if(i == 1) { 
            this.rewardPercentage2 = decoded[i];
          } else
          if(i == 2) { 
            this.rewardPercentage3 = decoded[i];
          } else
          if(i == 3) { 
            this.rewardPercentage4 = decoded[i];
          } else
          if(i == 4) { 
            this.rewardPercentage5 = decoded[i];
          } else
          if(i == 5) { 
            this.rewardPercentage6 = decoded[i];
          } else
          if(i == 6) { 
            this.rewardPercentage7 = decoded[i];
          } else
          if(i == 7) { 
            this.rewardPercentage8 = decoded[i];
          } else
          if(i == 8) { 
            this.rewardPercentage9 = decoded[i];
          } else
          if(i == 9) { 
            this.rewardPercentage10 = decoded[i];
          } else
          if(i == 10) { 
            this.rewardPercentage11 = decoded[i];
          }
          const item = {
            name: this.getRewardName(i),
            percentage: decoded[i]
          };
          this.rewardPercentages.push(item);
        }
      });
  }

  updateRewardCoins() {
    this.router.navigate(['/admin/fee-distribution/update-reward-coins'],
    { queryParams: {
      coin1: this.coin1, percentage1: this.percentage1,
      coin2: this.coin2, percentage2: this.percentage2,
      coin3: this.coin3, percentage3: this.percentage3
    }});
  }

  updateRewardPercentages() {
    this.router.navigate(['/admin/fee-distribution/update-reward-percentages'],
    { queryParams: {
      percentage1: this.rewardPercentage1,
      percentage2: this.rewardPercentage2,
      percentage3: this.rewardPercentage3,
      percentage4: this.rewardPercentage4,
      percentage5: this.rewardPercentage5,
      percentage6: this.rewardPercentage6,
      percentage7: this.rewardPercentage7,
      percentage8: this.rewardPercentage8,
      percentage9: this.rewardPercentage9,
      percentage10: this.rewardPercentage10,
      percentage11: this.rewardPercentage11
    }});
  }
}
