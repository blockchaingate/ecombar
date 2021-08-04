import { Component, Input, OnInit } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';
@Component({
  selector: 'app-product-item-two',
  templateUrl: './product-item-two.component.html',
  styleUrls: ['./product-item-two.component.scss']
})

export class ProductItemTwoComponent implements OnInit {
  lang: string;
  @Input() storeId: string;
  @Input() product: any;
  constructor(private storageServ: StorageService) {

  }
  
  ngOnInit() {
      this.lang = this.storageServ.lang;
      if (!this.lang) {
        this.storageServ.get('_lang').subscribe(
          (lang2: string) => {
            if (lang2) {
              this.lang = lang2;
            }
  
          }
        );
      }
  }
}
