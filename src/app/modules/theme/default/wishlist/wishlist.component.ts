import { Component, OnInit } from '@angular/core';
import { WishlistComponent as ParentWishlistComponent } from 'src/app/modules/store/wishlist/wishlist.component';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent extends ParentWishlistComponent{}
