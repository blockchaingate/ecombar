import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NftAssetService } from '../../services/nft-asset.service';
import { NftCollectionService } from '../../services/nft-collection.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { randomBytes } from 'crypto';
import BigNumber from 'bignumber.js/bignumber';
import assert from 'assert';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create',
    templateUrl: './collection-assets-create.component.html',
    styleUrls: ['./collection-assets-create.component.scss']
  })
  export class NftCollectionAssetsCreateComponent implements OnInit {
    step: number;
    asset: any;
    modalRef: BsModalRef;
    slug: string;
    collection: any;
    smartContractAddress: string;
    supply: number;
    media: string;
    tokenId: string;
    name: string;
    address: string;
    hide: boolean;
    wallet: any;
    externalLink: string;
    description: string;
    properties: any;
    levels: any;
    stats: any;
    isProxyAuthenticated: boolean;
    unlockableContent: string;

    propertiesModal: any;

    levelsModal: any;

    statsModal: any;

    constructor(
      private toastr: ToastrService,
      private coinServ: CoinService,
      private spinner: NgxSpinnerService,
      private modalService: BsModalService,
      private localSt: LocalStorage,
      private collectionServ: NftCollectionService,
      private kanbanSmartContract: KanbanSmartContractService,
      private utilServ: UtilService,

      private assetServ: NftAssetService,
      private translateServ: TranslateService,
      private kanbanServ: KanbanService, 
      private route: ActivatedRoute) {

    }

    saveProperties(props: any) {
      this.properties = props;
    }

    saveLevels(props: any) {
      this.levels = props;
    }

    saveStats(props: any) {
      this.stats = props;
    }

    async ngOnInit() {
      this.supply = 1;
      await this.translateServ.get('Add Properties').toPromise().then();
      this.propertiesModal = {
        type: 'properties',
        title: 'Add Properties',
        subtitle: "Properties show up underneath your item, are clickable, and can be filtered in your collection's sidebar.",
        data: []
      };
  
      this.levelsModal = {
        type: 'levels',
        title: 'Add Levels',
        subtitle: 'Levels show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
        data: []
      };
  
      this.statsModal = {
        type: 'levels',
        title: 'Add Stats',
        subtitle: 'Stats show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
        data: []
      };

      this.step = 1;
      this.route.paramMap.subscribe((params: ParamMap) =>  {
        this.slug = params.get('slug');   
        this.smartContractAddress = params.get('smartContractAddress');
        const getCollection = this.slug ? this.collectionServ.getBySlug(this.slug) : this.collectionServ.getBySmartContractAddress(this.smartContractAddress);
        getCollection.subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.collection = res._body;

              console.log('this.collection===', this.collection);
              this.tokenId = params.get('tokenId');
              if(this.tokenId) {
                this.assetServ.getBySmartContractTokenId(this.collection.smartContractAddress, this.tokenId).subscribe(
                  (retAsset: any) => {
                    console.log('retAsset for getBySmartContractTokenId=', retAsset);
                    if(retAsset && retAsset.ok) {
                      const token = retAsset._body;
                      console.log('token===', token);
                      this.name = token.name;
                      if(token.image) {
                        this.media = token.image;
                      }
                      this.externalLink = token.externalLink;
                      this.description = token.description;
                      this.properties = token.properties;
                      this.levels = token.levels;
                      this.stats = token.stats;
                      this.supply = token.quantity;
                      this.hide = token.hide;
                      this.unlockableContent = token.unlockableContent;
                      

/*
        media: this.media,
        name: this.name,
        externalLink: this.externalLink,
        description: this.description,
        properties: this.properties,
        levels: this.levels,
        stats: this.stats,
        quantity: this.supply,
        balances: [
          {
              owner: this.address,
              quantity: this.supply
          }
        ],
        smartContractAddress: this.collection.smartContractAddress,
        txhex: txhex,
        creator: this.address,
        unlockableContent: this.unlockableContent,
*/

                    }
                  }
                );
              }
            }
          }
        );

      });

      this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

        if(!wallets || !wallets.items || (wallets.items.length == 0)) {
          return;
        }
        const wallet = wallets.items[wallets.currentIndex];
        this.wallet = wallet;
        const addresses = wallet.addresses;
        this.address = addresses.filter(item => item.name == 'FAB')[0].address;   
        
     

      });      
    }

    async mineAssetDo(seed: Buffer, smartContractAddress: string) {
      this.spinner.show();
      let abi;;

      let args;
      const tokenId = '0x' + randomBytes(32).toString('hex');
      console.log('tokenId==', tokenId);
      if(this.collection.type == 'ERC1155') {
        abi = {
          "inputs": [
            {
              "internalType": "address",
              "name": "_initialOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "_initialSupply",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "_uri",
              "type": "string"
            },
            {
              "internalType": "bytes",
              "name": "_data",
              "type": "bytes"
            }
          ],
          "name": "create",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        args = [this.utilServ.fabToExgAddress(this.address), tokenId, '0x' + new BigNumber(this.supply).shiftedBy(18).toString(16), '', '0x0'];
      } else {
        abi  = {
          "constant": false,
          "inputs": [
            {
              "name": "_to",
              "type": "address"
            }
          ],
          "name": "mintTo",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        };
        args = [this.utilServ.fabToExgAddress(this.address)];
      }
      const txhex = await this.kanbanSmartContract.getExecSmartContractHex(seed, smartContractAddress, abi, args);

      const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
      const publicKey = await this.coinServ.toUncompressedPublicKey(keyPair.publicKey);
      console.log('publicKey===', publicKey);
      const asset = {
        media: this.media,
        name: this.name,
        externalLink: this.externalLink,
        description: this.description,
        properties: this.properties,
        levels: this.levels,
        hide: this.hide,
        stats: this.stats,
        quantity: this.supply,
        balances: [
          {
              owner: this.address,
              quantity: this.supply
          }
        ],
        smartContractAddress: this.collection.smartContractAddress,
        txhex: txhex,
        creator: this.address,
        unlockableContent: this.unlockableContent,
        tokenId: null
        //unlockableContent: this.unlockableContent ? this.utilServ.encrypt(publicKey, this.unlockableContent) : '',
        //unlockableContent: this.unlockableContent ? this.utilServ.encrypt(environment.PUBLIC_KEY, this.unlockableContent) : ''
      }
      if(this.collection.type == 'ERC1155') {
        asset.tokenId = tokenId;
      }

      this.assetServ.create(asset).subscribe(
        (res: any) => {
          if(res) {
            this.spinner.hide();
            if(res.ok) {
              this.step = 2;
              this.asset = res._body;
            } else {
              this.toastr.error('error while creating asset', 'Ok');
            }
          }
          //console.log('res from create asset=', res);
          //that.router.navigate(['/nft/admin/collections/' + that.slug + '/assets/create-done']);
        }
      );

    }

    createAssets() {

      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

      this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
        this.spinner.show();
        if(this.tokenId) {
          const asset = {
            media: this.media,
            name: this.name,
            externalLink: this.externalLink,
            description: this.description,
            properties: this.properties,
            levels: this.levels,
            hide: this.hide,
            stats: this.stats,
            quantity: this.supply,
            balances: [
              {
                  owner: this.address,
                  quantity: this.supply
              }
            ]
          };

          const keyPair = this.coinServ.getKeyPairs('FAB', seed, 0, 0, 'b');
          const privateKey = keyPair.privateKeyBuffer.privateKey;
          const sig = this.kanbanServ.signJsonData(privateKey, asset);
          asset['sig'] = sig.signature;  

          console.log('asset===', asset);
          this.assetServ.update(this.collection.smartContractAddress, this.tokenId, asset).subscribe(
            (ret: any) => {
              this.spinner.hide();
              if(ret && ret.ok) {
                this.toastr.success('Updated successfully.');
              } else {
                this.toastr.error(ret.error);
              }
            }
          );
        } else {
          await this.mineAssetDo(seed, this.collection.smartContractAddress);
        }
        
        
      });



      /*
      const asset = {
        media: this.media,
        name: this.name,
        externalLink: this.externalLink,
        description: this.description,
        properties: this.properties,
        levels: this.levels,
        stats: this.stats,
        unlockableContent: this.unlockableContent
      }

      this.assetServ.create(asset).subscribe(
        (res: any) => {
          console.log('res from create asset=', res);
          this.router.navigate(['/nft/admin/collections/' + this.slug + '/assets/create-done']);
        }
      );
      */
    }
  }
