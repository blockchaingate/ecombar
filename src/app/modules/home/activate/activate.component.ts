import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {
  products: any;
  activated: boolean;
  id: string;
  constructor(
    private route: ActivatedRoute,
    private userServ: UserService) {

  }
  ngOnInit() {
    this.activated = false;
    //:userId/:activationCode/:appId
    const userId = this.route.snapshot.paramMap.get('userId');
    const activationCode = this.route.snapshot.paramMap.get('activationCode');
    const appId = this.route.snapshot.paramMap.get('appId');
    this.userServ.activateUser(userId, activationCode, appId).subscribe(
      (res: any) => {
        console.log('resssss=', res);
        if(res.ok) {
          this.activated = true;
          console.log('your account was activated successfully');
        }
      }
    );
  }
}
