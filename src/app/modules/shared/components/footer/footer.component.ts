
import { Component, OnInit } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class NftFooterComponent implements OnInit {
    year = 2022;

    ngOnInit() {
        this.year = (new Date()).getFullYear();
    }
}
