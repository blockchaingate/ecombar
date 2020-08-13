import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  showNavMenu = false;
  dropDownActive = false;
  toggleShowNavMenu() {
    this.showNavMenu = !this.showNavMenu;
  }
  toggleDropDownActive() {
    this.dropDownActive = !this.dropDownActive;
  }  
}
