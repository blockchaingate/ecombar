import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-product-item-three',
  templateUrl: './product-item-three.component.html',
  styleUrls: ['./product-item-three.component.scss']
})

export class ProductItemThreeComponent implements OnInit {
  lang: string;
  @Input() product: any;
  @Input() storeId: string;
  @Output() addToCartEvent = new EventEmitter<string>();
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
    addToCart() {
      this.addToCartEvent.emit(this.product._id);
    }
}
