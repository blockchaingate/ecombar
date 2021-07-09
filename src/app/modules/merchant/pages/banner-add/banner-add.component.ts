import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';

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
  walletAddress: string;
  id: string;

  constructor(
    private dataServ: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private bannerServ: BannerService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );
    this.images = [];
    this.currentTab = 'default';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.bannerServ.getBanner(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const banner = res._body;

            this.title = banner.title[0].text;
            this.subtitle = banner.subtitle[0].text;
            this.sequence = banner.sequence;
            this.titleChinese = banner.title[1].text;
            this.subtitleChinese = banner.subtitle[1].text;
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
    const title = [
      {
        lan: 'en',
        text: this.title
      },
      {
        lan: 'sc',
        text: this.titleChinese
      }
    ];

    const subtitle = [
      {
        lan: 'en',
        text: this.subtitle
      },
      {
        lan: 'sc',
        text: this.subtitleChinese
      }
    ];    
    const data = {
      owner: this.walletAddress,
      title: title,
      subtitle: subtitle,
      image: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      sequence: this.sequence ? this.sequence : 0
    };
    console.log('data=', data);
    if (!this.id) {

      this.bannerServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/banners']);
          }
        }
      );
    } else {
      this.bannerServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/banners']);
          }
        }
      );
    }

  }
}
