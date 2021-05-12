import { Component, OnInit, forwardRef } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
    selector: 'app-nft-account-activity-event-type',
    templateUrl: './account-activity-event-type.component.html',
    styleUrls: ['./account-activity-event-type.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NftAccountActivityEventTypeComponent),
        multi: true
    }]
  })
  export class NftAccountActivityEventTypeComponent implements ControlValueAccessor, OnInit {
      eventTypes = [
        'Create',
        'List',
        'Sale',
        'Offer',
        'Transfer'
      ];
      selectedEventTypes: any;
      ngOnInit() {
        if(!this.selectedEventTypes) {
            this.selectedEventTypes = [];
          }   
      }

      changeSelection(eventType) {
        const index = this.selectedEventTypes.indexOf(eventType);
        if( index >= 0) {
            this.selectedEventTypes.splice(index, 1);
        } else {
            this.selectedEventTypes.push(eventType);
        }      
      }  
      
      isSelected(eventType) {
        if(!this.selectedEventTypes) {
          return false;
        }
        return this.selectedEventTypes.indexOf(eventType) >= 0;
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
          this.onChange(this.selectedEventTypes);
      }
  
      ///////////////
      // OVERRIDES //
      ///////////////
  
      /**
       * Writes a new item to the element.
       * @param value the value
       */
      writeValue(value: any): void {
          this.selectedEventTypes = value;
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