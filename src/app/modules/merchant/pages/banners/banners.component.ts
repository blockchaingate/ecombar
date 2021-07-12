import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-banners',
  providers: [BannerService],
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', '../../../../../table.scss']
})
export class BannersComponent implements OnInit {
  banners: any;
  constructor(
    private dataServ: DataService,
    private router: Router,
    private bannerServ: BannerService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        
        if(walletAddress) {
          this.getMerchantBanners(walletAddress);
        }
        
      }
    );
  }

  getMerchantBanners(walletAddress: string) {
    console.log('go here');
    this.bannerServ.getMerchantBanners(walletAddress).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.banners = res._body;
        }
      }
    );
  }

  editBanner(banner) {
    this.router.navigate(['/merchant/banner/' + banner._id + '/edit']);
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
