import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { UtilService } from '../../../shared/services/util.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { OrderRewardsComponent } from './rewards/rewards.component';
import { RequestRefundComponent } from '../../modals/request-refund/request-refund.component';
import { RefundComponent } from '../../modals/refund/refund.component';
import { KanbanSmartContractService } from '../../../shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { StarService } from '../../../shared/services/star.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import BigNumber from 'bignumber.js';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss', '../../../../../table.scss']
})
export class OrderHistoryComponent implements OnInit {
    @Input() transactionHistories: any;
    @Input() wallet: any;
    @Input() type: string;
    
    walletAddress: string;
    modalRef: BsModalRef;
    realOrder: any;
    refundData: any;
    requestRefundData: any;
    op: string;
    order: any;
    constructor(
        private dataServ: DataService,
        private starServ: StarService,
        private coinServ: CoinService,
        private orderServ: OrderService,
        private kanbanServ: KanbanService,
        private web3Serv: Web3Service,
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

    showRewards(orderId: string) {
      this.starServ.getRewardsByOrderId(orderId).subscribe(
        (ret: any) => {
          if(ret && ret.ok) {
            const rewards = ret._body;

            const modalOptions = {
              initialState: {
              rewards: rewards
              },
              class: 'modal-lg'
              };
       
            
            this.modalRef = this.modalService.show(OrderRewardsComponent, modalOptions);
          }
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

        this.starServ.getOrderVersion(order._id).subscribe(
          (ret: any) => {
            console.log('retfttttt=', ret);
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                this.op = 'requestRefund';
                this.order = order;
                this.getPassword();
              } else 
              if(version == 2){ //version 2

                const realOrderId = order.id.substring(2, 26);
                console.log('realOrderId=', realOrderId);
                this.orderServ.get(realOrderId).subscribe(
                  (ret: any) => {
                    console.log('ret in get(realOrderId)=', ret);
                    if(ret && ret.ok) {
                      this.realOrder = ret._body;
                      const initialState = {
                        order: order,
                        realOrder: this.realOrder
                      };          
                      
                      this.modalRef = this.modalService.show(RequestRefundComponent, { initialState });
                      this.modalRef.content.onClose.subscribe( async (requestRefundData: any) => {
                        console.log('requestRefundData===', requestRefundData);
                        this.op = 'requestRefundV2';
                        this.order = order;
                        this.requestRefundData = requestRefundData;
                        this.getPassword();
                      });
                    }
                  }
                );



              }

            }
          }
        );

      }

      cancelRequestRefund(order) {
        this.op = 'cancelRequestRefund';
        this.order = order;
        this.getPassword();       
      }

      refund(order) {
        this.starServ.getOrderVersion(order._id).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                this.op = 'refund';
                this.order = order;
                this.getPassword();   
              } else { //version 2
                const realOrderId = order.id.substring(2, 26);
                this.orderServ.get(realOrderId).subscribe(
                  (ret: any) => {
                    if(ret && ret.ok) {
                      this.realOrder = ret._body;
                      const initialState = {
                        order: order,
                        realOrder: this.realOrder
                      };          
                      
                      this.modalRef = this.modalService.show(RefundComponent, { initialState });
                      this.modalRef.content.onClose.subscribe( async (refundData: any) => {
                        console.log('refundData===', refundData);
                        this.op = 'refundV2';
                        this.order = order;
                        this.refundData = refundData;
                        this.getPassword();
                      });
                    }
                  }
                );
              }
            }
          });        
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
          if(this.op == 'requestRefundV2') {
            this.requestRefundV2Do(seed);
          } else
          if(this.op == 'refundV2') {
            this.refundV2Do(seed);
          } else
          if(this.op == 'cancelRequestRefund') {
            this.cancelRequestRefundDo(seed);
          }else
          if(this.op == 'refund') {
            this.refundDo(seed);
          }
        });
      }
      refundV2Do(seed) {
        if(!this.refundData) {
          return;
        }
        const realOrderId = this.order.id.substring(2, 26);
        this.orderServ.getRefund(realOrderId).subscribe(
          async (retRefund: any) => {
            console.log('ret for getRefund ==', retRefund);
            
            if(retRefund && retRefund.ok) {
              const body = retRefund._body;
              const newOrderID = body.newOrderID
              const originalOrderID = body.originalOrderID;
              const customer = body.customer;
              const paidCoin = this.coinServ.getCoinTypeIdByName(body.paidCoin);
              const refundAmount = '0x' + new BigNumber(body.refundAmount).shiftedBy(18).toString(16);
              const refundTax = '0x' + new BigNumber(body.refundTax).shiftedBy(18).toString(16);
              const refundRewardInPaidCoin = '0x' + new BigNumber(body.refundRewardInPaidCoin).shiftedBy(18).toString(16);
              const regionalAgents = body.regionalAgents;
              const rewardBeneficiary = body.rewardBeneficiary;
              const v = body.v;
              const r = body.r;
              const s = body.s;
              const rewardInfo = body.rewardInfo;
              let abi;
              let args;
              if(body.refundAll) {
                abi = {
                  "inputs": [
                    {
                      "internalType": "bytes32",
                      "name": "_newOrderID",
                      "type": "bytes32"
                    },
                    {
                      "internalType": "bytes32",
                      "name": "_originalOrderID",
                      "type": "bytes32"
                    },
                    {
                      "internalType": "address",
                      "name": "_customer",
                      "type": "address"
                    },
                    {
                      "internalType": "uint32",
                      "name": "_paidCoin",
                      "type": "uint32"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_refundAmount",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_refundTax",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_refundRewardInPaidCoin",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address[]",
                      "name": "_regionalAgents",
                      "type": "address[]"
                    },
                    {
                      "internalType": "address[]",
                      "name": "_rewardBeneficiary",
                      "type": "address[]"
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
                  "name": "refundAllWithSig",
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
                args = [
                  newOrderID, originalOrderID, customer, paidCoin, refundAmount, refundTax, 
                  refundRewardInPaidCoin, regionalAgents, rewardBeneficiary, v, r, s
                ];
              } else {
                abi = {
                  "inputs": [
                    {
                      "internalType": "bytes32",
                      "name": "_newOrderID",
                      "type": "bytes32"
                    },
                    {
                      "internalType": "bytes32",
                      "name": "_originalOrderID",
                      "type": "bytes32"
                    },
                    {
                      "internalType": "address",
                      "name": "_customer",
                      "type": "address"
                    },
                    {
                      "internalType": "uint32",
                      "name": "_paidCoin",
                      "type": "uint32"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_refundAmount",
                      "type": "uint256"
                    },
                    {
                      "internalType": "uint256",
                      "name": "_refundTax",
                      "type": "uint256"
                    },
                    {
                      "internalType": "address[]",
                      "name": "_regionalAgents",
                      "type": "address[]"
                    },
                    {
                      "internalType": "bytes32[]",
                      "name": "_rewardBeneficiary",
                      "type": "bytes32[]"
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
                    },
                    {
                      "internalType": "bytes",
                      "name": "_rewardInfo",
                      "type": "bytes"
                    }
                  ],
                  "name": "refundSomeWithSig",
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
                args = [
                  newOrderID, originalOrderID, customer, paidCoin, refundAmount, refundTax, 
                  regionalAgents, rewardBeneficiary, v, r, s, rewardInfo
                ];
              }
              console.log('abi===', abi);
              console.log('args===', args);
              console.log('to===', this.order.address);
              const ret = await this.kanbanSmartContractServ.execSmartContract(seed, this.order.address, abi, args);
              this.spinner.hide();
              if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
                this.order.status = 2;
                this.toastr.success('Refund was made successfully');
              } else {
                this.toastr.error('Failed to refund');
                
              }
            } else {
              this.spinner.hide();
              this.toastr.error('Failed to get request refund information');
            }
          }
        );
      }
      requestRefundV2Do(seed: Buffer) {
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;
        const requestRefundId = this.utilServ.genRanHex(64);
        const requestRefundSig = this.web3Serv.signKanbanMessageHashWithPrivateKey(requestRefundId, privateKey);
        const data = {
          refundAll: this.requestRefundData.refundAll,
          items: this.requestRefundData.items.filter(item => item.quantity > 0),
          requestRefundId: '0x' + requestRefundId,
          requestRefundSig: requestRefundSig.signature
        };
        const sig = this.kanbanServ.signJsonData(privateKey, data);
        data['sig'] = sig.signature;   
        this.orderServ.requestRefund(this.realOrder._id, data).subscribe(
          (ret: any) => {
            this.spinner.hide();
            if(ret && ret.ok && ret._body && ret._body._id) {
              this.toastr.success('Request refund was made successfully');
            } else {
              this.toastr.error('Failed to request refund');
            }
          }
        );
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
        this.starServ.getOrderVersion(this.order._id).subscribe(
          async (ret: any) => {
            if(ret && ret.ok) {
              const version = ret._body.version;
              if(!version) { //version 0
                await this.cancelRequestRefundV1Do(seed);
              } else
              if(version == 2) {
                await this.cancelRequestRefundV2Do(seed);
              }
            }
          });  
      }

      async cancelRequestRefundV2Do(seed: Buffer) {
        const realOrderId = this.order.id.substring(2, 26);
        const data = {
          id: realOrderId
        }
        const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
        const privateKey = keyPair.privateKeyBuffer.privateKey;
        const sig = this.kanbanServ.signJsonData(privateKey, data);
        data['sig'] = sig.signature;   
        this.orderServ.cancelrequestRefundV2(data).subscribe(
          (ret: any) => {
            this.spinner.hide();
            if(ret && ret.ok && ret._body && ret._body._id) {
              this.toastr.success('Request refund was canceled successfully');
            } else {
              this.toastr.error('Failed to cancel request refund');
            }
          }
        );
      }

      async cancelRequestRefundV1Do(seed: Buffer) {
      
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