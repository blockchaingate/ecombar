import { Component } from '@angular/core';
import { AddressComponent as ParentAddressComponent} from '../../../store/address/address.component';
@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  
})
export class AddressComponent extends ParentAddressComponent {
 
}