import { Component, OnInit } from '@angular/core';
import { NewsletterService } from 'src/app/modules/shared/services/newsletter.service';
import { Router } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';

@Component({
  selector: 'app-admin-newsletters',
  providers: [],
  templateUrl: './newsletters.component.html',
  styleUrls: ['./newsletters.component.scss', '../../../../../table.scss']
})
export class NewslettersComponent implements OnInit {
  newsletters: any;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private router: Router,
    private newsletterServ: NewsletterService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantNewsletters(walletAddress);
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  getMerchantNewsletters(walletAddress: string) {
    console.log('go here');
    this.newsletterServ.getMerchantNewsletters(walletAddress).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.newsletters = res._body;
          console.log('this.newsletterss=', this.newsletters);
        }
      }
    );
  }

  deleteNewsletter(newsletter_id: string) {

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
      this.deleteNewsletterDo(privateKey, newsletter_id);
    });
  }

  deleteNewsletterDo(privateKey, newsletter_id) {
    const data = {
      id: newsletter_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.newsletterServ.deleteNewsletter(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.newsletters = this.newsletters.filter((item) => item._id != newsletter_id);
        }
      }
    );
  }
}
