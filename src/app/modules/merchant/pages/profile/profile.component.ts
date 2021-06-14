import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-admin-profile',
  providers: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  displayName: string;
  // myPhotoUrl: string;
  images: any;
  constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private router: Router) {
  }

  ngOnInit() {
    this.images = [];
    this.userServ.getMe().subscribe(
      (res: any) => {
        if(res && res.ok) {
          const data = res._body;
          this.displayName = data.displayName;
          
          if(data.myPhotoUrl) {
            this.images.push(data.myPhotoUrl); 
          }
          console.log('data=', data);
        }
      }
    );
  }

  update() {
    const data = {
      displayName: this.displayName,
      myPhotoUrl: (this.images && (this.images.length > 0)) ? this.images[0] : null
    };
    
    this.userServ.updateSelf(data).subscribe(
      (res: any) => {
        if(res && res.ok) {
          console.log('update successfully');
        }
      }
    );
  }
}