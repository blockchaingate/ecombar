
import { Component, OnInit } from '@angular/core';
import { AddressComponent as ParentAddressComponent} from '../../../store/address/address.component';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: [
    './address.component.scss',
    '../../../../../page.scss'
  ]
})
export class AddressComponent extends ParentAddressComponent { }
