import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { StorageService } from 'src/app/modules/shared/services/storage.service';

@Component({
  selector: 'app-product-item-four',
  templateUrl: './product-item-four.component.html',
  styleUrls: ['./product-item-four.component.scss']
})

export class ProductItemFourComponent implements OnInit {
  lang: string;
  @Input() product: any;
  @Input() storeId: string;
  @Input() currency: string;
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
