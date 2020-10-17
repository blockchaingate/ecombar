import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { OrderService } from '../../shared/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss', '../../../../select.scss', '../../../../button.scss']
})
export class AddressComponent implements OnInit {
  name: string;
  suite: string;
  streetNumber: string;
  street: string;
  district: string;
  city: string;
  province: string;
  postcode: string;
  country: string;
  id: string;
  orderID: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userServ: UserService,
    private orderServ: OrderService,
    private addressServ: AddressService) {

  }

  ngOnInit() {
    this.orderID = this.route.snapshot.paramMap.get('orderID');
    this.userServ.getMe().subscribe(
      (res: any) => {
        console.log('resme==', res);
        if (res && res.ok) {
          const member = res._body;
          if (member.homeAddressId) {
            this.id = member.homeAddressId;
            this.addressServ.getAddress(member.homeAddressId).subscribe(
              (res: any) => {
                console.log('res for addressss=', res);
                if (res && res.ok) {
                  const address = res._body;
                  this.name = address.name;
                  this.suite = address.suite;
                  this.streetNumber = address.streetNumber;
                  this.street = address.street;
                  this.district = address.district;
                  this.city = address.city;
                  this.province = address.province;
                  this.postcode = address.postcode;
                  this.country = address.country;
                  console.log('res  for address=', res);
                }
              }
            );
          }
        }

      }
    );
  }

  updateOrderAddress() {
    const updatedOrder = {
      name: this.name,
      unit: this.suite,
      streetNumber: this.streetNumber,
      streetName: this.street,
      city: this.city,
      province: this.province,
      zip: this.postcode,
      country: this.country
    };

    this.orderServ.update(this.orderID, updatedOrder).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.addAddress();
        }
      }
    );
  }

  /*
  name: String,
  company: String,
  unit: String,
  streetNumber: String,
  streetName: String,
  streetName2: String,
  city: String,
  province: String,
  zip: String,
  country: String,  
  */
  confirm() {
    this.updateOrderAddress();
  }
  addAddress() {

    const address = {
      name: this.name,
      suite: this.suite,
      streetNumber: this.streetNumber,
      street: this.street,
      district: this.district,
      city: this.city,
      province: this.province,
      postcode: this.postcode,
      country: this.country
    };
    if (this.id) {
      this.addressServ.updateAddress(this.id, address).subscribe(
        (res: any) => {
          console.log('res for updateAddress', address);
          if (res && res.ok) {
            this.router.navigate(['/payment/' + this.orderID]);
          }
        }
      );
    } else {
      this.addressServ.addAddress(address).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const _body = res._body;
            const addressId = _body._id;
            const body = {
              homeAddressId: addressId
            }
            this.userServ.updateSelf(body).subscribe(
              (res: any) => {
                console.log('res for updateSelf=', res);
                if (res && res.ok) {
                  this.router.navigate(['/payment/' + this.orderID]);
                }
              }
            );
          }
          console.log('res for addAddress', address);
        }
      );
    }
  }
}