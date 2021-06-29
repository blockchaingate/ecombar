import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantService } from '../../../shared/services/merchant.service';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-banner-add',
  providers: [BannerService],
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class BannerAddComponent implements OnInit {
  sequence: number;
  title: string;
  images: any;
  titleChinese: string;
  subtitle: string;
  subtitleChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private userServ: UserService,
    private authServ: AuthService,
    private merchantServ: MerchantService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerServ: BannerService) {
  }

  ngOnInit() {
    this.images = [];
    this.currentTab = 'default';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.bannerServ.getBanner(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const banner = res._body;

            this.title = banner.title.en;
            this.subtitle = banner.subtitle.en;
            this.sequence = banner.sequence;
            this.titleChinese = banner.title.sc;
            this.subtitleChinese = banner.subtitle.sc;
            if(banner.image) {
              this.images.push(banner.image);
            }
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addBanner() {
    const data = {
      title: {
        en: this.title,
        sc: this.titleChinese
      },
      subtitle: {
        en: this.subtitle,
        sc: this.subtitleChinese
      },
      image: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      sequence: this.sequence ? this.sequence : 0
    };
    if (!this.id) {

      this.bannerServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/banners']);
          }
        }
      );
    } else {
      this.bannerServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/banners']);
          }
        }
      );
    }

  }
}
