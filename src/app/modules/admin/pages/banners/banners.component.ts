import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { MerchantService } from '../../../shared/services/merchant.service';

@Component({
  selector: 'app-admin-banners',
  providers: [BannerService],
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class BannersComponent implements OnInit {
  banners: any;
  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private router: Router,
    private bannerServ: BannerService) {
  }

  ngOnInit() {
    const merchantId = this.merchantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.getAdminBanners();
    } else
      if (merchantId) {
        this.getMerchantBanners(merchantId);
      }
  }

  getMerchantBanners(merchantId: string) {
    this.bannerServ.getMerchantBanners(merchantId).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.banners = res._body;
        }
      }
    );
  }

  getAdminBanners() {
    this.bannerServ.getAdminBanners().subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.banners = res._body;
        }
      }
    );
  }

  editBanner(banner) {
    this.router.navigate(['/admin/banner/' + banner._id + '/edit']);
  }

  deleteBanner(banner) {
    this.bannerServ.deleteBanner(banner._id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.banners = this.banners.filter((item) => item._id != banner._id);
        }
      }
    );
  }
}
