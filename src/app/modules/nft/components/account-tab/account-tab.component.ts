import { Component, OnInit, Output, EventEmitter, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-nft-account-tab',
    templateUrl: './account-tab.component.html',
    styleUrls: ['./account-tab.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NftAccountTabComponent),
        multi: true
    }]  
  })
  export class NftAccountTabComponent implements ControlValueAccessor, OnInit {
    ngOnInit() {
          
    }


    /**
     * Holds the current value of the slider
     */
     value: string = '';

     /**
      * Invoked when the model has been changed
      */
     onChange: (_: any) => void = (_: any) => {};
 
     /**
      * Invoked when the model has been touched
      */
     onTouched: () => void = () => {};
 
     constructor() {}
 
     /**
      * Method that is invoked on an update of a model.
      */
     updateChanges() {
         this.onChange(this.value);
     }
 
     ///////////////
     // OVERRIDES //
     ///////////////
 
     /**
      * Writes a new item to the element.
      * @param value the value
      */
     writeValue(value: string): void {
         this.value = value;
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