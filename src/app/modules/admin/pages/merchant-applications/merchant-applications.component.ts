import { Component, OnInit } from '@angular/core';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-merchant-applications',
  templateUrl: './merchant-applications.component.html',
  styleUrls: ['./merchant-applications.component.scss']
})
export class MerchantApplicationsComponent implements OnInit {
  merchants: any;

  constructor(
    private merchantServ: MerchantService) { }
  ngOnInit() {
    console.log('merchant go');


    this.merchantServ.getAll().subscribe(
            (res: any) => {
              console.log('res==', res);
              if (res && res.ok) {
                this.merchants = res._body;
                console.log('this.merchants111', this.merchants);
              }
            }
    ); 

  }

  approve(merchant) {
    console.log('begin approve');
    this.merchantServ.approve(merchant._id).subscribe(
      (res: any) => {
        console.log('res for approve=', res);
        if (res.ok) {
          console.log('this.merchants=', this.merchants);
          if(this.merchants && this.merchants.length) {
            for (let i = 0; i < this.merchants.length; i++) {
              if (this.merchants[i]._id === merchant._id) {
                this.merchants[i].approved = true;
                break;
              }
            }
          }

        }
      }
    );
  }
}
