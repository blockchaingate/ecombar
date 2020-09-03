import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Router } from '@angular/router';

@Component({
  providers: [UserService],
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit{
  showNavMenu = false;
  dropDownActive = false;

  menuItems: any;
  constructor(private router: Router, private userServ: UserService) {

  }
  
  ngOnInit() {
    const aud = this.userServ.getAud();
    const merchantId = this.userServ.getMerchantId();
    console.log('aud=', aud);
    if (aud == 'isSystemAdmin') {
      this.menuItems = [
        {
          title: 'Dashboard',
          link: './'
        },
        {
          title: 'Category',
          link: 'categories'
        }        
      ]
    } else 
    if (merchantId) {
      this.menuItems = [
        {
          title: 'Dashboard',
          link: './'
        },
        {
          title: 'Product',
          link: 'products'
        }        
      ]      
    }
  }

  logout() {
    this.userServ.saveToken('');
    this.router.navigate(['/auth/signin']);
  }

  toggleShowNavMenu() {
    this.showNavMenu = !this.showNavMenu;
  }
  toggleDropDownActive() {
    this.dropDownActive = !this.dropDownActive;
  }  
}
