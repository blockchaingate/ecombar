import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-receive',
    templateUrl: './receive.component.html',
    styleUrls: ['./receive.component.scss'],
    encapsulation: ViewEncapsulation.None
  })
  export class ReceiveComponent implements OnInit {
      coins: any;
      addresses: any;
      link: string;
      currentCoin: string;
      currentCoinAddress: string;

      constructor(public modalRef: BsModalRef) {
      }
      ngOnInit() {
        this.onCoinChange('FAB');
      }

      onCoinChange(newCoin) {
        this.currentCoin = newCoin;
        this.currentCoinAddress = this.getCurrentCoinAddress();
      }   
      
      close() {
          this.modalRef.hide();
      }

      formatName(coinName) {
          if(coinName == 'USDTX') {
            return 'USDT(TRC20)'
          } else
          if(coinName == 'FABE') {
              return 'FAB(ERC20)';
          } else
          if(coinName == 'EXGE') {
              return 'EXG(ERC20)';
          } else
          if(coinName == 'BSTE') {
              return 'BST(ERC20)';
          } else
          if(coinName == 'DSCE') {
              return 'DSC(ERC20)';
          }
          return coinName;
      }
      
      getCurrentCoinAddress() {
        const addresses = this.addresses;
        console.log('addresses==', addresses);
        let fabAddress = '';
        let ethAddress = '';
        let trxAddress = '';
        for (let i = 0; i < addresses.length; i++) {
          const addr = addresses[i];
          if (addr.name == this.currentCoin) {
            return addr.address;
          }
          if (addr.name == 'FAB') {
            fabAddress = addr.address;
          }
          if (addr.name == 'ETH') {
            ethAddress = addr.address;
          }
          if (addr.name == 'TRX') {
            trxAddress = addr.address;
          }          
        }
    
        if (
            this.currentCoin == 'EXG' 
            || this.currentCoin == 'DUSD'
            || this.currentCoin == 'BST'
            || this.currentCoin == 'DSC'
            ) {
          return fabAddress;
        }

        if(this.currentCoin == 'USDTX') {
            return trxAddress;
        }
        return ethAddress;
      }
      
      dlDataUrlBin() {
        const y = document.getElementById('address_qr_code').getElementsByTagName('canvas')[0];
        //console.log('y.src=' + y.src);
        if (y) {
          var link = y.toDataURL("image/png");
          this.link = link;
        }
    
      }      
  }