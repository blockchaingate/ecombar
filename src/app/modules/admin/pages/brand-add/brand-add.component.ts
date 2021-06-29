import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../shared/services/brand.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantService } from '../../../shared/services/merchant.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-brand-add',
  providers: [],
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class BrandAddComponent implements OnInit {
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    private brandServ: BrandService) {
  }

  ngOnInit() {
    this.currentTab = 'default';
    const merchantId = this.merchantServ.id;

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.brandServ.getBrand(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const brand = res._body;

            this.name = brand.name.en;
            this.nameChinese = brand.name.sc;
            this.sequence = brand.sequence;
            
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addBrand() {
    const data = {
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      sequence: this.sequence ? this.sequence : 0
    };
    if (!this.id) {

      this.brandServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/brands']);
          }
        }
      );
    } else {
      this.brandServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/brands']);
          }
        }
      );
    }

  }
}
