import { Component, OnInit } from '@angular/core';
import { SmallBannerService } from 'src/app/modules/shared/services/small-banner.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
    selector: 'app-small-banners',
    templateUrl: './small-banners.component.html',
    styleUrls: ['./small-banners.component.scss']
})
export class SmallBannersComponent implements OnInit {
    banners: any;
    constructor( 
        private dataServ: DataService,
        private smallBannerServ: SmallBannerService) {}
    ngOnInit() {
        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                    this.smallBannerServ.getMerchantBanners(walletAddress).subscribe(
                        (ret: any) => {
                            if(ret && ret.ok) {
                                this.banners = ret._body;
                            }
                        }
                    );
                }
            }
        );
        
    }
}