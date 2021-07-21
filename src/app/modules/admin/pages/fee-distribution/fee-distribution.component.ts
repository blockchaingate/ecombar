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
          const item = {
            name: this.getRewardName(i),
            percentage: decoded[i]
          };
          this.rewardPercentages.push(item);
        }
      });
  }

  updateRewardCoins() {
    this.router.navigate(['/admin/fee-distribution/update-reward-coins']);
  }

  updateRewardPercentages() {
    this.router.navigate(['/admin/fee-distribution/update-reward-percentages']);
  }
}
