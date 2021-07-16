import { Component, OnInit } from '@angular/core';
import { IddockService } from '../../shared/services/iddock.service';
import { UtilService } from '../../shared/services/util.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-blockchain-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  id: string;
  type: string;
  people: any;
  things: any;
  organization: any;
  constructor(private router: Router, private iddockServ: IddockService, public utilServ: UtilService) { }

  ngOnInit() {

  }

  update(type: string, item: any) {
    this.router.navigate(['/blockchain/update-info/' + type + '/' + this.utilServ.sequenceId2ObjectId(item._id.substring(0, 60))]);
  }

  history(type: string, item: any) {
    this.router.navigate(['/blockchain/history/' + type + '/' + this.utilServ.sequenceId2ObjectId(item._id.substring(0, 60))]);
  }

  owner(type: string, item: any) {
    this.router.navigate(['/blockchain/owner/' + type + '/' + this.utilServ.sequenceId2ObjectId(item._id.substring(0, 60))]);
  }

  search() {
    if(!this.type) {
      this.type = 'all';
    }
    this.iddockServ.findAll(this.type, this.id).subscribe(
      (ret) => {
        console.log('ret==', ret);
        if(ret && ret.ok) {
          const body = ret._body;
          this.people = body.people;
          this.things = body.things;
          this.organization = body.organization;
        }
      }
    );
  }
}
