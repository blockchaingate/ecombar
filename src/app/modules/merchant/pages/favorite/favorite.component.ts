import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { FavoriteService } from 'src/app/modules/shared/services/favorite.service';

@Component({
  selector: 'app-admin-favorite',
  providers: [],
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit{
    favorites: any;
    
    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private favoriteServ: FavoriteService,
      private router: Router) {
    }

    ngOnInit() {
      this.getFavoriteProducts();
    }

    getFavoriteProducts() {
      this.favoriteServ.getMine().subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.favorites = res._body;
          }
        }
      );
    }
 
    removeFavorite(favorite) {
      this.favoriteServ.deleteFavorite(favorite._id).subscribe(
        (res: any) => {
          if(res && res.ok) {
            this.favorites = this.favorites.filter(item => item._id != favorite._id);
          }
        }
      );
    }
}