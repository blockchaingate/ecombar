import { Component, OnInit, forwardRef } from '@angular/core';
import { NftCollectionService } from '../../services/nft-collection.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-nft-account-in-wallet-collections',
    templateUrl: './account-in-wallet-collections.component.html',
    styleUrls: ['./account-in-wallet-collections.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NftAccountInWalletCollectionsComponent),
        multi: true
    }]
  })
  export class NftAccountInWalletCollectionsComponent implements ControlValueAccessor, OnInit {
    collections: any;
    selectedCollections: any;
    constructor(private collectionServ: NftCollectionService) {}
    ngOnInit() {
        this.collections = [];
        if(!this.selectedCollections) {
            this.selectedCollections = [];
        }
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



     /**
      * Invoked when the model has been changed
      */
     onChange: (_: any) => void = (_: any) => {};
 
     /**
      * Invoked when the model has been touched
      */
     onTouched: () => void = () => {};
 
 
     /**
      * Method that is invoked on an update of a model.
      */
     updateChanges() {
         this.onChange(this.selectedCollections);
     }
 
     ///////////////
     // OVERRIDES //
     ///////////////
 
     /**
      * Writes a new item to the element.
      * @param value the value
      */
     writeValue(value: any): void {
         this.selectedCollections = value;
         this.updateChanges();
     }
 
     /**
      * Registers a callback function that should be called when the control's value changes in the UI.
      * @param fn
      */
     registerOnChange(fn: any): void {
         this.onChange = fn;
     }
 
     /**
      * Registers a callback function that should be called when the control receives a blur event.
      * @param fn
      */
     registerOnTouched(fn: any): void {
         this.onTouched = fn;
     }

  }
