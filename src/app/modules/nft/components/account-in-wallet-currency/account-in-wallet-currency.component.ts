import { Component, OnInit, forwardRef } from '@angular/core';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NftCollectionService } from '../../services/nft-collection.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-nft-account-in-wallet-currency',
    templateUrl: './account-in-wallet-currency.component.html',
    styleUrls: ['./account-in-wallet-currency.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NftAccountInWalletCurrencyComponent),
        multi: true
    }]
  })
  export class NftAccountInWalletCurrencyComponent implements OnInit {
    acceptableCoins: any;

    selectedCoins: any;

    constructor(private utilServ: UtilService) {}
    ngOnInit() {
      if(!this.selectedCoins) {
        this.selectedCoins = [];
      }      
      this.acceptableCoins = this.utilServ.getAcceptableCoins();
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
          this.onChange(this.selectedCoins);
      }
  
      ///////////////
      // OVERRIDES //
      ///////////////
  
      /**
       * Writes a new item to the element.
       * @param value the value
       */
      writeValue(value: any): void {
          this.selectedCoins = value;
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