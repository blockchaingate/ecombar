import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { MerchantService } from '../shared/services/merchant.service';

@Component({
  providers: [UserService],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showNavMenu = false;
  dropDownActive = false;
  email: string;

  menuItems: any;
  constructor(
    private router: Router,
    private authServ: AuthService,
    private merthantServ: MerchantService,
    private userServ: UserService
  ) { }

  ngOnInit() {
    this.email = this.userServ.email;
    const merchantId = this.merthantServ.id;

    if (this.userServ.isSystemAdmin) {
      this.menuItems = [
        {
          title: 'Dashboard',
          link: 'dashboard'
        },
        {
          title: 'Banner',
          link: 'banners'
        },
        {
          title: 'Category',
          link: 'categories'
        },
        {
          title: 'Collection',
          link: 'collections'
        },
        {
          title: 'Users',
          link: 'users'
        }
      ]
    } else
      if (merchantId) {
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard'
          },
          {
            title: 'Banner',
            link: 'banners'
          },
          {
            title: 'Category',
            link: 'categories'
          },
          {
            title: 'Collection',
            link: 'collections'
          },
          {
            title: 'Product',
            link: 'products'
          },
          {
            title: 'Merchant information',
            link: 'merchant-info'
          }
        ]
      } else {
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard'
          },
          {
            title: 'Address',
            link: 'address'
          }
        ];
      }
  }

  logout() {
    this.userServ.logout();
    this.router.navigate(['/auth/signin']);
  }

  profile() {
    this.router.navigate(['/admin/profile']);
  }

  toggleShowNavMenu() {
    this.showNavMenu = !this.showNavMenu;
  }

  toggleDropDownActive() {
    this.dropDownActive = !this.dropDownActive;
  }
}
