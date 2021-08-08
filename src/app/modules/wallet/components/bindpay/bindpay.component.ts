import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { StarService } from 'src/app/modules/shared/services/star.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NgxSpinnerService } from 'ngx-bootstrap-spinner';

@Component({
  selector: 'app-wallet-bindpay',
  providers: [],
  templateUrl: './bindpay.component.html',
  styleUrls: ['./bindpay.component.scss']
})
export class BindpayComponent implements OnInit{
    modalRef: BsModalRef;
    wallet: any;
    name: string;
    to: string;
    walletAddress: string;
    tab: string;
    data: string;
    args: any;
    transactionHistories: any;
    parents: string[];

    constructor(    
        private kanbanSmartContractServ: KanbanSmartContractService,
        private dataServ: DataService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private starServ: StarService,
        private web3Serv: Web3Service,
        private utilServ: UtilService,
        public kanbanServ: KanbanService,
        private modalService: BsModalService,) {}
    ngOnInit() {
        this.tab =  'pay';
        this.parents = [];
        this.dataServ.currentWallet.subscribe(
            (wallet: string) => {
              this.wallet = wallet;
            }
        ); 

        this.route.queryParams.subscribe(params => {
            this.name = params['name'];
            this.to = params['to'];
            this.data = params['data'];
            this.args = this.web3Serv.decodeData(['bytes32', 'uint32', 'uint256', 'address[]'], this.data.substring(10));
            console.log('decoded=', this.args);
        });

        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                  this.walletAddress = walletAddress;
                    this.starServ.getParents(walletAddress).subscribe(
                        (ret: any) => {
                            console.log('ret for getParents=', ret);
                            this.parents = ret.map(item => this.utilServ.fabToExgAddress(item));
                        }
                    );
                }
            }
        );
        
    }

    changeTab(tab: string) {
      this.tab = tab;
      if(tab == "history") {
        this.starServ.getTransactionHisotryForCustomer(this.walletAddress).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              this.transactionHistories = ret._body;
            }
          }
        );
      }
    }



    submit() {
        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
        };          
          
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
            this.spinner.show();
            this.submitDo(seed);
        });        
    }

    async submitDo(seed: Buffer) {
        const abi = {
            "constant": false,
            "inputs": [
              {
                "name": "_orderID",
                "type": "bytes32"
              },
              {
                "name": "_coinType",
                "type": "uint32"
              },
              {
                "name": "_totalAmount",
                "type": "uint256"
              },
              {
                "name": "_rewardBeneficiary",
                "type": "address[]"
              }
            ],
            "name": "chargeFundsWithFee",
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

        this.args[3] = this.parents;
        
        const args = [
            this.args[0],
            this.args[1],
            this.args[2],
            this.args[3]
        ];

        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.to, abi, args);
        this.spinner.hide();
        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
            this.toastr.success('the transaction was procssed successfully');
        } else {
            this.toastr.error('Failed to process the transaction');
        }
    }

}