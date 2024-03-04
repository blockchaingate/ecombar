import { Component, OnInit } from '@angular/core';
import { TopCategoryBannerService } from 'src/app/modules/shared/services/top-category-banner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-top-category-banner-add',
  providers: [],
  templateUrl: './top-category-banner-add.component.html',
  
})
export class TopCategoryBannerAddComponent implements OnInit {
  modalRef: BsModalRef;
  wallet: any;    
  sequence: number;
  title: string;
  images: any;
  clickLink: string;
  titleChinese: string;
  subtitle: string;
  subtitleChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private dataServ: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private bannerServ: TopCategoryBannerService) {
  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.images = [];
    this.currentTab = 'default English';

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
            this.clickLink = banner.clickLink;
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

  imagesChange(event) {
    
  }
  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addBanner() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.addBannerDo(privateKey);
    });
  }


  addBannerDo(privateKey: any) {
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
      title: title,
      subtitle: subtitle,
      clickLink: this.clickLink,
      image: (this.images && (this.images.length > 0)) ? this.images[0] : null,
      sequence: this.sequence ? this.sequence : 0
    };
    
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  
    if (!this.id) {

      this.bannerServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/top-category-banners']);
          }
        }
      );
    } else {
      this.bannerServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/top-category-banners']);
          }
        }
      );
    }

  }
}
