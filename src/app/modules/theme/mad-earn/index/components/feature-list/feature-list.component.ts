import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { FeatureService } from 'src/app/modules/shared/services/feature.service';

@Component({
  selector: 'app-feature-list',
  templateUrl: './feature-list.component.html',
  styleUrls: ['./feature-list.component.css']
})
export class FeatureListComponent implements OnInit {
  features = [
    {
      icon: 'ec-transport',
      title: 'Free Delivery',
      subtitle: 'from $50'
    },
    {
      icon: 'ec-customers',
      title: '99 % Customer',
      subtitle: 'Feedbacks'
    },
    {
      icon: 'ec-returning',
      title: '30 Days',
      subtitle: 'for free return'
    },
    {
      icon: 'ec-payment',
      title: 'Payment',
      subtitle: 'Secure System'
    },
    {
      icon: 'ec-tag',
      title: 'Only Best',
      subtitle: 'Brands'
    }   
  ]
  constructor(
    private dataServ: DataService,
    private featureServ: FeatureService) { }

  ngOnInit() {
    this.dataServ.currentStoreOwner.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.featureServ.getMerchantFeatures(walletAddress).subscribe(
            (ret: any) => {
              if(ret && ret.ok && ret._body && ret._body.length > 0) {
                this.features = ret._body;
              }
            }
          );
        }
      }
    );
    
  }

}
