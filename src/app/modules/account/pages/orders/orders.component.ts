import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss', '../../../../../table.scss']
})
export class OrdersComponent implements OnInit {
  orders: any;
  order: any;
  customerFlag: boolean;
  modalRef: BsModalRef;
  walletAddress: string;
  wallet: any;
  constructor(
    public kanbanServ: KanbanService,
    private utilServ: UtilService,
    private web3Serv: Web3Service,
    private coinServ: CoinService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private orderServ: OrderService) {
  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
        this.orderServ.getMyOrders(walletAddress).subscribe(
          (res: any) => {
              if(res && res.ok) {
                this.orders = res._body;
              }
          }
        ); 
      }
    );
  }

  getItemsCount(order) {
    let count = 0;
    let items = order.items;
    for(let i=0;i<items.length;i++) {
      const item = items[i];
      if(item.quantity) {
        count += item.quantity;
      }
      
    }
    return count;
  }


  trimText(id:string) {
    return id.substring(0,3) + '...' + id.substring(id.length - 3);
  }
  getStatus(order) {
    let status = '';
    const paymentStatus = order.paymentStatus;
    if(!paymentStatus) {
      status = 'waiting for pay';
    } else 
    if(paymentStatus == 1) {
      status = 'paid already';
    } else 
    if(paymentStatus == 2) {
      status = 'payment confirmed';
    } else 
    if(paymentStatus == 3) {
      status = 'payment cancelled';
    } else 
    if(paymentStatus == 4) {
      status = 'payment frozened';
    } else 
    if(paymentStatus == 5) {
      status = 'request refund';
    } else 
    if(paymentStatus == 6) {
      status = 'refunded';
    }
    return status;
  }

  deleteOrder(order) {
    this.orderServ.delete(order._id).subscribe(
      (res: any) => {
        
      }
    );
  }

  requestRefund(order: any) {
    this.order = order;

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.requestRefundDo(seed);
    });
  }
  
  async requestRefundDo(seed: Buffer) {
    console.log('this.order=', this.order);
    const abi = {
      "inputs": [
        {
          "internalType": "bytes30",
          "name": "objectId",
          "type": "bytes30"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "requestRefundWithSig",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
    const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey; 
    const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey); 
    const args = [
      '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
      this.utilServ.fabToExgAddress(this.walletAddress),
      signature.v,
      signature.r,
      signature.s
    ];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      const data = {
        paymentStatus: 5
      };
      this.orderServ.update(this.order._id, data).subscribe(
        (ret: any) => {
          this.spinner.hide();
          if(ret && ret.ok) {
            this.toastr.success('Request refund was made successfully');
            this.order.paymentStatus = 5;
          }
        }
      );
    } else {
      this.toastr.error('Failed to request refund');
      this.spinner.hide();
    }

  }


  cancelRequestRefund(order: any) {
    this.order = order;

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.cancelRequestRefundDo(seed);
    });
  }
  
  async cancelRequestRefundDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "objectId",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "v",
          "type": "uint8"
        },
        {
          "internalType": "bytes32",
          "name": "r",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "s",
          "type": "bytes32"
        }
      ],
      "name": "cancelRefundRequestWithSig",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const msg = '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId) + '0000';
    const hashForSignature = this.web3Serv.hashKanbanMessage(msg);
    const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
    const privateKey = keyPair.privateKeyBuffer.privateKey; 
    const signature = this.web3Serv.signKanbanMessageHashWithPrivateKey(hashForSignature, privateKey); 
    const args = [
      '0x' + this.utilServ.ObjectId2SequenceId(this.order.objectId),
      this.utilServ.fabToExgAddress(this.walletAddress),
      signature.v,
      signature.r,
      signature.s
    ];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      const data = {
        paymentStatus: 2
      };
      this.orderServ.update(this.order._id, data).subscribe(
        (ret: any) => {
          this.spinner.hide();
          console.log('ret for update payment=', ret);
          if(ret && ret.ok) {
            this.toastr.success('Cancel request refund was made successfully');
            this.order.paymentStatus = 2;
          }
        }
      );
    } else {
      this.toastr.error('Failed to cancel request refund');
      this.spinner.hide();
    }
  }



}
