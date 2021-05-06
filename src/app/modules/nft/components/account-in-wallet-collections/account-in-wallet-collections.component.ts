import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NftCollectionService } from '../../services/nft-collection.service';

@Component({
    providers: [],
    selector: 'app-nft-account-in-wallet-collections',
    templateUrl: './account-in-wallet-collections.component.html',
    styleUrls: ['./account-in-wallet-collections.component.scss']
  })
  export class NftAccountInWalletCollectionsComponent implements OnInit {
    collections: any;
    selectedCollections: any;
    constructor(private collectionServ: NftCollectionService) {}
    ngOnInit() {
        this.collections = [];
        this.selectedCollections = [];
        this.collectionServ.getAll().subscribe(
            (ret: any) => {
                if(ret && ret.ok) {
                    this.collections = ret._body;
                    console.log('this.collections=', this.collections);
                }
            }
        );
    }

    changeSelection(collection) {
        const index = this.selectedCollections.indexOf(collection);
        if( index >= 0) {
            this.selectedCollections.splice(index, 1);
        } else {
            this.selectedCollections.push(collection);
        }
    }

    isSelected(collection) {
        return this.selectedCollections.indexOf(collection) >= 0;
    }
  }
