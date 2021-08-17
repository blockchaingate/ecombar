import { Component, OnInit, OnDestroy } from '@angular/core';
declare var $: any;
@Component({
    selector: 'app-slide-show',
    templateUrl: './slide-show.component.html',
    styleUrls: ['./slide-show.component.scss']
})
export class SlideShowComponent implements OnInit, OnDestroy {
    slideIndex = 1;
    interval: any;
    ngOnInit() {
        

        $('#myCarousel').carousel({
            interval: 3000,
         })
    }

    ngOnDestroy() {
        // clearInterval(this.interval);
    }

    // plusSlides(n: number) {
    //     this.slideIndex = (this.slideIndex - 1 + n) % 3 + 1;
    // }

    // currentSlide(n: number) {
    //     this.slideIndex = n;
    // }
}
