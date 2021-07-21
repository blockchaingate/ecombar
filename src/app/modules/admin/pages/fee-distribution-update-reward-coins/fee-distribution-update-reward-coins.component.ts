import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-fee-distribution-update-reward-coins',
  templateUrl: './fee-distribution-update-reward-coins.component.html',
  styleUrls: ['./fee-distribution-update-reward-coins.component.css']
})
export class FeeDistributionUpdateRewardCoinsComponent implements OnInit {
  to: string;
  walletAddress: string;
  owner: string;

  coin1: string;
  percentage1: number;
  coin2: string;
  percentage2: number;
  coin3: string;
  percentage3: number;  

  constructor(
    private dataServ: DataService,
    private coinServ: CoinService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private web3Serv: Web3Service,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.to = environment.addresses.smartContract.exchangeRate;
    this.checkOwner();
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    ); 
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
        console.log('ret for isOwner===', ret);
        const kanbanAddress = '0x' + ret.data.substring(ret.data.length - 40);
        console.log('kanbanAddress==', kanbanAddress);
        this.owner = this.utilServ.exgToFabAddress(kanbanAddress);
      }
    );
  }  
}
