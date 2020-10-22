import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  displayName: string;
  email: string;

  menuItems: any;
  constructor(
    private router: Router,
    private merchantServ: MerchantService,
    private userServ: UserService
  ) { }

  ngOnInit(): void {
    this.email = this.userServ.email;
    this.displayName = this.userServ.displayName;
    const merchantId = this.merchantServ.id;
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
        },
        {
          title: 'Orders',
          link: 'orders'
        },        
        {
          title: 'Upload',
          link: 'upload'
        }
      ];
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
            title: 'Orders',
            link: 'orders'
          },           
          {
            title: 'Merchant information',
            link: 'merchant-info'
          }
        ];
      } else {
        this.menuItems = [
          {
            title: 'Dashboard',
            link: 'dashboard'
          },
          {
            title: 'Address',
            link: 'address'
          },
          {
            title: 'Order',
            link: 'orders'
          }
        ];
      }
  }

  logout(): void {
    this.userServ.logout();
    this.router.navigate(['/auth/signin']);
  }

  profile(): void {
    this.router.navigate(['/admin/profile']);
  }

  toggleShowNavMenu(): void {
    this.showNavMenu = !this.showNavMenu;
  }

  toggleDropDownActive(): void {
    this.dropDownActive = !this.dropDownActive;
  }
}
