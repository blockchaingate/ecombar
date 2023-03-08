import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-orders',
  providers: [OrderService],
  templateUrl: './orders.component.html',
  styleUrls: [
    './orders.component.scss', 
    '../../../../../table.scss',
    '../../../../../page.scss'
  ]
})
export class OrdersComponent implements OnInit {
  orders: any;
  order: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    public kanbanServ: KanbanService,
    private router: Router,
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
        if(walletAddress) {
          this.orderServ.gerMerchantOrders(walletAddress).subscribe(
            (res: any) => {
                // if(res && res.ok) {
                //   this.orders = res._body;
                // }
                this.orders = res;
            }
          );
        }
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

    trimText( id:string ) {    // 地址不长，不用此函数，用户可复制地址
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


  refund(order: any) {
    this.order = order;

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.spinner.show();
      this.refundDo(seed);
    });
  }
  
  async refundDo(seed: Buffer) {
    console.log('this.order=', this.order);
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "objectId",
          "type": "bytes32"
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
      "name": "refundWithSig",
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
      signature.v,
      signature.r,
      signature.s
    ];
    const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.store.smartContractAddress, abi, args);
    this.spinner.hide();
    if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
      /*
      const data = {
        paymentStatus: 6
      };
      this.orderServ.update2(this.order._id, data).subscribe(
        (ret: any) => {
          this.spinner.hide();
          if(ret && ret.ok) {
            this.order.paymentStatus = 6;
            this.toastr.success('Refund was made successfully');
          }
        }
      );
      */
      this.order.paymentStatus = 6;
      this.toastr.success('Refund was made successfully');
    } else {
      
      this.toastr.error('Failed to approve refund');
    }
  }
}
