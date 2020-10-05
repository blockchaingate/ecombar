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
  email: string;

  menuItems: any;
  constructor(private router: Router, private userServ: UserService) {

  }
  
  ngOnInit() {
    this.userServ.getToken().subscribe(
      (token: any) => {
        const decoded = this.userServ.decodeToken(token);
        console.log('decoded=', decoded);
        const aud = decoded.aud;
        this.email = decoded.email;
        const merchantId = decoded.merchantId;
        
        if (aud == 'isSystemAdmin') {
          this.menuItems = [
            {
              title: 'Dashboard',
              link: './'
            },
            {
              title: 'Category',
              link: 'categories'
            },
            {
              title: 'Collectionß',
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
              link: './'
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
            }        
          ]      
        }

      }
    );

  }

  logout() {
    this.userServ.saveToken('').subscribe((res: any) => {
      this.router.navigate(['/auth/signin']);
    });
    
  }

  toggleShowNavMenu() {
    this.showNavMenu = !this.showNavMenu;
  }
  toggleDropDownActive() {
    this.dropDownActive = !this.dropDownActive;
  }  
}
