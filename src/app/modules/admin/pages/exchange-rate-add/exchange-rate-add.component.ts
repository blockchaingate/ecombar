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
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-exchange-rate-add',
  templateUrl: './exchange-rate-add.component.html',
  styleUrls: ['./exchange-rate-add.component.css']
})
export class ExchangeRateAddComponent implements OnInit {
  modalRef: BsModalRef;
  coinName: string;
  to: string;
  coinId: number;
  rate: number;
  walletAddress: string;
  owner: string;
  wallet: any;

  constructor(
    private dataServ: DataService,
    private coinServ: CoinService,
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
    this.to = environment.addresses.smartContract.exchangeRate;
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

    this.route.paramMap.subscribe((params: ParamMap) =>  {
      this.coinName = params.get('coinName');   
      this.coinId = this.coinServ.getCoinTypeIdByName(this.coinName);
    });

    this.route.queryParamMap.subscribe(
      (map: any) => {
        const params = map.params;
        this.rate = params.rate;
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
  confirm() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.addRateDo(seed);
    });
  }

  async addRateDo(seed: Buffer) {
    
    const abi = {
      "constant": false,
      "inputs": [
        {
          "name": "_token",
          "type": "uint32"
        },
        {
          "name": "_rate",
          "type": "uint256"
        }
      ],
      "name": "setExchangeRate",
      "outputs": [
        
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [this.coinId, this.rate * 1e8];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.to, abi, args);
    this.spinner.hide();
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      this.toastr.success('exchange rate was updated successfully');
      this.router.navigate(['/admin/exchange-rate']);
    } else {
      this.toastr.error('Error while updating exchange rate');
    }
  }
}