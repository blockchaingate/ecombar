import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-admin-user-add',
  providers: [UserService],
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit{
    name: string;
    id: string;
    user: any;
    defaultMerchant: string;
    parentReferMemberId: string;
    refCode: string;
    campaignReferral: any;
    constructor(
      private route: ActivatedRoute,
      private userServ: UserService) {

    }

    ngOnInit() {
      this.id = this.route.snapshot.paramMap.get('id');
      if(this.id) {
        this.userServ.getUser(this.id).subscribe(
          (res: any) => {
            
            this.user = res;
            this.defaultMerchant = res.defaultMerchant ? res.defaultMerchant._id : '';
          }
        );
        this.userServ.getCampaignReferral(this.id).subscribe(
          (res: any) => {
            console.log('res in getCampaignReferral====', res);
            this.campaignReferral = res;
            this.parentReferMemberId = res.parentReferMemberId;
          }
        );
      }
    }

    addUser() {

    }

    addParentReferral() {
      const body = {
        campaignId: 1,
        memberId: this.id,
        parentReferMemberId: this.parentReferMemberId,
        refCode: this.refCode
      };
      this.userServ.addParentReferral(body).subscribe(
        (res: any) => {
          console.log('res===', res);
        }
      );
    }
 
    updateUser() {
      /*
      console.log('updated for user=', this.parentRefCode);
      const body = {
        id: this.id,
        parentRefCode: this.parentRefCode
      }
      this.userServ.update(body).subscribe(
        (res: any) => {
          if(res) {
            console.log('res==', res);
          }
        }
      );
      */
    }
}
