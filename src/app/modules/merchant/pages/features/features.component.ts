import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../../../shared/services/feature.service';
import { Router } from '@angular/router';
import { DataService } from '../../../shared/services/data.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from '../../../shared/services/kanban.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.css', '../../../../../table.scss']
})
export class FeaturesComponent implements OnInit {

  features: any;
  wallet: any;
  modalRef: BsModalRef;

  constructor(
    public kanbanServ: KanbanService,
    private modalService: BsModalService,
    private dataServ: DataService,
    private router: Router,
    private featureServ: FeatureService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.getMerchantFeatures(walletAddress);
        }
      }
    );
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  getMerchantFeatures(walletAddress: string) {
    console.log('go here');
    this.featureServ.getMerchantFeatures(walletAddress).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.features = res._body;
        }
      }
    );
  }

  editFeature(feature) {
    this.router.navigate(['/merchant/feature/' + feature._id + '/edit']);
  }

  deleteFeature(feature_id) {

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
      this.deleteFeatureDo(privateKey, feature_id);
    });
  }

  deleteFeatureDo(privateKey, feature_id) {
    const data = {
      id: feature_id
    };
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;        
    this.featureServ.deleteFeature(data).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.features = this.features.filter((item) => item._id != feature_id);
        }
      }
    );
  }

}
