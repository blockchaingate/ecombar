//https://testnets.opensea.io/assets/0xee45b41d1ac24e9a620169994deb22739f64f231/5404270212490003160468058955419049373696167535371251252745102991339628265473/sell

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftOrder } from '../../models/nft-order';
import { NftPortService } from '../../services/nft-port.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftOrderService } from '../../services/nft-order.service';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { Web3Service } from 'src/app/modules/shared/services/web3.service';

@Component({
    providers: [],
    selector: 'app-nft-asset-sell',
    templateUrl: './asset-sell.component.html',
    styleUrls: ['./asset-sell.component.scss']
  })
  export class NftAssetSellComponent implements OnInit {
    asset: any;
    smartContractAddress: string;
    tokenId: string;
    address: string;
    wallet: any;
    modalRef: BsModalRef;
    coin: string;
    quantity: number;

    constructor(
      private localSt: LocalStorage,
      private route: ActivatedRoute,
      private router: Router,
      private web3Serv: Web3Service,
      private coinServ: CoinService,
      private spinner: NgxSpinnerService,
      private utilServ: UtilService,
      private assetServ: NftAssetService,
      private nftPortServ: NftPortService,
      private orderServ: NftOrderService,
      private modalServ: BsModalService
      ) {

    }
    ngOnInit() {

      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        this.wallet = wallet;
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;
      });      

      this.route.paramMap.subscribe((params: ParamMap) =>  {
        const smartContractAddress = params.get('smartContractAddress');   
        const tokenId = params.get('tokenId'); 
        this.smartContractAddress = smartContractAddress;
        this.tokenId = tokenId;
        this.assetServ.getBySmartContractTokenId(smartContractAddress, tokenId).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.asset = res._body;
            }
          }
        );
      });          
    }

    async postListingDo(privateKey: Buffer) {
      const makerRelayerFee = 250;
      const coinType = this.coinServ.getCoinTypeIdByName(this.coin);
      const price = this.quantity;
      const addressHex = this.utilServ.fabToExgAddress(this.address);

      const order: NftOrder = this.nftPortServ.createSellOrder(
        addressHex, 
        this.asset.smartContractAddress, 
        this.asset.tokenId,
        coinType, 
        price,
        makerRelayerFee);



      const {signature, hash, hashForSignature} = await this.nftPortServ.getOrderSignature(order, privateKey);
      order.hash = hash;
      order.hashForSignature = hashForSignature;
      order.r = signature.r;
      order.s = signature.s;
      order.v = signature.v;


      this.orderServ.create(order).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.spinner.hide();
            /*
            this.router.navigate(
              ['/nft/assets/' + this.smartContractAddress + '/' + this.tokenId]
            );
            */
          }
        }
      );
    } 

    postListing() {
      
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onCloseFabPrivateKey.subscribe( (privateKey: any) => {
        this.spinner.show();
        this.postListingDo(privateKey);
      });
    }

    onUpdateEntity(event) {
      this.coin = event.coin;
      this.quantity = event.quantity;
    }
  
  }
