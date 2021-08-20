import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss', '../../../../../table.scss']
})
export class OrderHistoryComponent implements OnInit {
    @Input() transactionHistories: any;
    @Input() wallet: any;
    walletAddress: string;
    modalRef: BsModalRef;
    op: string;
    order: any;
    constructor(
        private dataServ: DataService,
        private kanbanSmartContractServ: KanbanSmartContractService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private utilServ: UtilService) {

    }

    ngOnInit() {
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
    }

    showDate(date) {
        return date.toString();
      }
      showAmount(amount) {
        return Number(this.utilServ.showAmount(amount, 18));
      }
      
      showId(id: string) {
        return id.substring(0, 3) + '...' + id.substring(id.length - 3);
      }
  
      showStatus(status: number) {
        
        if(status == 0) {
          return 'refunded';
        } else
        if(status == 1) {
          return 'valid';
        } else 
        if(status == 2) {
          return 'request refund';
        }
        return '';
      }

      requestRefund(order) {
        this.op = 'requestRefund';
        this.order = order;
        this.getPassword();
      }

      cancelRequestRefund(order) {
        this.op = 'cancelRequestRefund';
        this.order = order;
        this.getPassword();       
      }

      refund(order) {
        this.op = 'refund';
        this.order = order;
        this.getPassword();           
      }

      getPassword(){
        const initialState = {
          pwdHash: this.wallet.pwdHash,
          encryptedSeed: this.wallet.encryptedSeed
        };          
        
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
    
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
          this.spinner.show();
          if(this.op == 'requestRefund') {
            this.requestRefundDo(seed);
          }else 
          if(this.op == 'cancelRequestRefund') {
            this.cancelRequestRefundDo(seed);
          }else
          if(this.op == 'refund') {
            this.refundDo(seed);
          }
        });
      }

      async requestRefundDo(seed: Buffer) {
        const abi = {
            "constant": false,
            "inputs": [
              {
                "name": "_orderID",
                "type": "bytes32"
              }
            ],
            "name": "requestRefund",
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

        const args = [
          this.order.id
        ];
        
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);
        this.spinner.hide();

        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 2;
          this.toastr.success('Request refund was made successfully');
        } else {
          this.toastr.error('Failed to request refund');
          
        }
    
      }

      async cancelRequestRefundDo(seed: Buffer) {
        const abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_orderID",
              "type": "bytes32"
            }
          ],
          "name": "cancelRefundRequest",
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

        const args = [
          this.order.id
        ];
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);
        this.spinner.hide();
        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 1;
          this.toastr.success('Request refund was cancelled successfully');
        } else {
          this.toastr.error('Failed to cancel request refund');
        }
    
      }

      async refundDo(seed: Buffer) {
        const abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_orderID",
              "type": "bytes32"
            }
          ],
          "name": "refund",
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

        const args = [
          this.order.id
        ];
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);
        this.spinner.hide();
        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
          this.order.status = 0;
          this.toastr.success('Refund was processed successfully');
        } else {
          this.toastr.error('Failed to make the refund');
        }
    
      }
}