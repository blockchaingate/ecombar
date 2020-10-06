import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-banner-add',
  providers: [BannerService],
  templateUrl: './banner-add.component.html',
  styleUrls: ['./banner-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class BannerAddComponent implements OnInit{
    sequence: number;
    banners: any;
    title: string;
    titleChinese: string;
    subtitle: string;
    subtitleChinese: string;    
    currentTab: string;
    id: string;

    constructor(
      private userServ: UserService,
      private route: ActivatedRoute,
      private router: Router,
      private bannerServ: BannerService) {

    }

    ngOnInit() {

      this.currentTab = 'default';
      this.userServ.getToken().subscribe(
        (token: any) => {
          const decoded = this.userServ.decodeToken(token);
          const aud = decoded.aud;
          const merchantId = decoded.merchantId;
  
          if (aud == 'isSystemAdmin') {
            this.bannerServ.getAdminBanners().subscribe(
              (res:any) => {
                if(res && res.ok) {
                  this.banners = res._body;
                }
              }
            );
          }  else 
          if (merchantId) {
            this.bannerServ.getMerchantBanners(merchantId).subscribe(
              (res:any) => {
                if(res && res.ok) {
                  this.banners = res._body;
                }
              }
            );
          }
        } 
      );

      this.id = this.route.snapshot.paramMap.get('id');
      if(this.id) {
        this.bannerServ.getBanner(this.id).subscribe(
          (res: any) => {
            console.log('ressssss=', res);
            if(res && res.ok) {
              const banner = res._body;
              
              this.title = banner.title.en;
              this.subtitle = banner.subtitle.en;
              this.sequence = banner.sequence;
              this.titleChinese = banner.title.zh;
              this.subtitleChinese = banner.subtitle.zh;
            }
            
          }
        );
      }      
    }

    changeTab(tabName: string) {
      this.currentTab = tabName;
    }

    addProduct() {
      const data = {
        title: {
          en: this.title,
          zh: this.titleChinese
        },
        subtitle: {
            en: this.subtitle,
            zh: this.subtitleChinese
        },        
        sequence: this.sequence
      };      
      if(!this.id) {

        this.bannerServ.create(data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.router.navigate(['/admin/banners']);
            }
          }
        );
      } else {
        this.bannerServ.update(this.id, data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.router.navigate(['/admin/banners']);
            }
          }
        );
      }

    }
}
