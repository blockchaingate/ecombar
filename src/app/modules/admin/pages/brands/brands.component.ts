import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../shared/services/brand.service';
import { UserService } from '../../../shared/services/user.service';
import { MerchantService } from '../../../shared/services/merchant.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-brands',
  providers: [BrandService, UserService],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss', '../../../../../table.scss']
})
export class BrandsComponent implements OnInit {
  brands: any;

  constructor(
    private userServ: UserService,
    private merchantServ: MerchantService,
    private router: Router,
    private brandServ: BrandService) {

  }

  ngOnInit() {

    this.getBrands();
  }
  getBrands() {
    const merchantId = this.merchantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.brandServ.getBrands().subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.brands = res._body;
          }
        }
      );
    } else
      if (merchantId) {
        this.brandServ.getMerchantBrands(merchantId).subscribe(
          (res: any) => {
            if (res && res.ok) {
              this.brands = res._body;
            }
          }
        );
      }
  }

  editBrand(brand) {
    this.router.navigate(['/admin/brand/' + brand._id + '/edit']);
  }

  deleteBrand(product) {
    this.brandServ.deleteBrand(product._id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.brands = this.brands.filter((item) => item._id != product._id);
        }
      }
    );
  }
}
