import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/modules/shared/services/brand.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-admin-brand-add',
  providers: [],
  templateUrl: './brand-add.component.html',
  
})
export class BrandAddComponent implements OnInit {
  modalRef: BsModalRef;
  wallet: any;  
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public kanbanServ: KanbanService,
    private dataServ: DataService,
    private modalService: BsModalService,
    private brandServ: BrandService) {
  }

  ngOnInit() {
 
    this.currentTab = 'default';
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.brandServ.getBrand(this.id).subscribe(
        (res: any) => {
          console.log('ressssss for brand=', res);
          if (res && res.ok) {
            const brand = res._body;
            console.log('brand=', brand);
            this.name = brand.name[0].text;
            this.nameChinese = brand.name[1].text;
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
      this.addBrandDo(privateKey);
    });
  }

  addBrandDo(privateKey: any) {

    const name = [
      {
        lan: 'en',
        text: this.name
      },
      {
        lan: 'sc',
        text: this.nameChinese
      }
    ];      
    const data = {
      name: name,
      sequence: this.sequence ? this.sequence : 0
    };
    
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;   
    if (!this.id) {

      this.brandServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/brands']);
          }
        }
      );
    } else {
      this.brandServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/brands']);
          }
        }
      );
    }

  }
}
