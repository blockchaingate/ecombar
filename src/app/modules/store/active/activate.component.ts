import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    template: ''
  })
export abstract class ActivateComponent implements OnInit {
    products: any;
    activated: boolean;
  
    constructor(private route: ActivatedRoute, private userServ: UserService) { }
  
    ngOnInit() {
      this.activated = false;
      //:userId/:activationCode/:appId
      const userId = this.route.snapshot.paramMap.get('userId');
      const activationCode = this.route.snapshot.paramMap.get('activationCode');
      this.userServ.activateUser(userId, activationCode).subscribe(
        (res: any) => {
          console.log('resssss=', res);
          if (res.ok || res._id) {
            this.activated = true;
            console.log('your account was activated successfully');
          }
        }
      );
    }
  }
  