import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannerService } from 'src/app/modules/shared/services/banner.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
    selector: 'app-slide-show',
    templateUrl: './slide-show.component.html',
    styleUrls: ['./slide-show.component.scss']
})
export class SlideShowComponent implements OnInit, OnDestroy {
    slideIndex = 1;
    interval: any;
    banners: any;
    constructor(
        private dataServ: DataService,
        private bannerServ: BannerService) {}
    ngOnInit() {
        this.banners = [
            {
                image: '/assets/images/banners/banner1.png'
            }
        ];
        this.dataServ.currentStoreOwner.subscribe(
            (owner: string) => {
                this.bannerServ.getMerchantBanners(owner).subscribe(
                    (ret: any) => {
                        console.log('');
                        if(ret && ret.ok && ret._body && ret._body.length > 0) {
                            this.banners = ret._body;
                            console.log('this.banners==', this.banners);
                        }
                    }
                );
            }
        );
        
        this.interval = setInterval(() => {
            this.plusSlides(1, this.banners.length);
        }, 2000);

    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    plusSlides(n: number, total: number) {
        this.slideIndex = (this.slideIndex - 1 + n) % total + 1;
    }

    currentSlide(n: number) {
        this.slideIndex = n;
    }
}
