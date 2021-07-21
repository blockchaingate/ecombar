import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { environment } from 'src/environments/environment';
import { coin_list_for_ecombar } from '../../../../config/coins';
@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css', '../../../../../table.scss']
})
export class ExchangeRateComponent implements OnInit {
  coin_list = coin_list_for_ecombar;
  constructor(
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    
    private utilServ: UtilService, 
    private router: Router,
    private coinServ: CoinService) { }

  ngOnInit(): void {
    
    this.coin_list.forEach(async coin => {
      const coinName = coin.name;
      const rate = await this.getRate(coinName);
      coin['rate'] = rate;
    });
  }

  async getRate(coinName: string) {
    const to = environment.addresses.smartContract.exchangeRate;
    const coinId = this.coinServ.getCoinTypeIdByName(coinName);
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "_token",
          "type": "uint32"
        }
      ],
      "name": "getExchangeRate",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const args = [coinId];
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
    const ret = await this.kanbanServ.kanbanCallAsync(to, abiData);
    const data = ret.data;
    const rate = parseInt(data, 16) / 1e8;
    return rate;
  }

  editExchangeRate(coinName) {
    this.router.navigate(['/admin/exchange-rate/' + coinName + '/edit']);
  }
}
