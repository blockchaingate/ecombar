import { Component, OnInit } from '@angular/core';
import { BrandService } from 'src/app/modules/shared/services/brand.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Router } from '@angular/router';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';

@Component({
  selector: 'app-admin-brands',
  providers: [BrandService, UserService],
  templateUrl: './brands.component.html',
  styleUrls: [
    './brands.component.scss',
    '../../../../../table.scss',
    '../../../../../page.scss'
  ]
})
export class BrandsComponent implements OnInit {
  brands: any;
  wallet: any;
  modalRef: BsModalRef;
  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private router: Router,
    private brandServ: BrandService) {

  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantBrands(walletAddress);
        }
        
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: string) => {
        this.wallet = wallet;
      }
    ); 
  }
  getMerchantBrands(walletAddress: string) {
    this.brandServ.getMerchantBrands(walletAddress, 100, 0).subscribe(
      (res: any) => {
        console.log('resssss=', res);
        if (res) {
          this.brands = res;
        }
      }
    );
  }

  editBrand(brand_id: string) {
    this.router.navigate(['/merchant/brand/' + brand_id + '/edit']);
  }

  deleteBrand(brand_id) {

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
      this.deleteBrandDo(privateKey, brand_id);
    });
  }

  deleteBrandDo(privateKey: any, brand_id: string) {
    const data = {
      id: brand_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.brandServ.deleteBrand(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.brands = this.brands.filter((item) => item._id != brand_id);
        }
      }
    );
  }

}
