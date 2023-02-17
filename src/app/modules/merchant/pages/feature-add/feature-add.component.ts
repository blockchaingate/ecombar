import { Component, OnInit } from '@angular/core';
import { FeatureService } from 'src/app/modules/shared/services/feature.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-feature-add',
  templateUrl: './feature-add.component.html',
  styleUrls: []
})
export class FeatureAddComponent implements OnInit {

  modalRef: BsModalRef;
  wallet: any;    
  title: string;
  titleChinese: string;
  subtitle: string;
  subtitleChinese: string;
  currentTab: string;
  icon: string;
  id: string;

  icons: string[] = [
    'ec-transport',
    'ec-customers',
    'ec-returning',
    'ec-payment',
    'ec-tag'
  ];

  constructor(
    private dataServ: DataService,
    private route: ActivatedRoute,
    private router: Router,
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private featureServ: FeatureService) {
  }

  ngOnInit() {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
    this.currentTab = 'default English';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.featureServ.getFeature(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const feature = res._body;

            this.title = feature.title[0].text;
            this.subtitle = feature.subtitle[0].text;
            this.titleChinese = feature.title[1].text;
            this.subtitleChinese = feature.subtitle[1].text;
            this.icon = feature.icon;
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addFeature() {

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
      this.addFeatureDo(privateKey);
    });
  }


  addFeatureDo(privateKey: any) {
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
      icon: this.icon
    };
    
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;  
    if (!this.id) {

      this.featureServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/features']);
          }
        }
      );
    } else {
      this.featureServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/features']);
          }
        }
      );
    }

  }

}
