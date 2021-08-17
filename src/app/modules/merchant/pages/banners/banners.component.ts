import { Component, OnInit } from '@angular/core';
import { BannerService } from '../../../shared/services/banner.service';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from '../../../shared/services/kanban.service';

@Component({
  selector: 'app-admin-banners',
  providers: [],
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss', '../../../../../table.scss']
})
export class BannersComponent implements OnInit {
  banners: any;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
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
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
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

  deleteBanner(banner_id) {

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
      this.deleteBannerDo(privateKey, banner_id);
    });
  }

  deleteBannerDo(privateKey, banner_id) {
    const data = {
      id: banner_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.bannerServ.deleteBanner(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.banners = this.banners.filter((item) => item._id != banner_id);
        }
      }
    );
  }
}
