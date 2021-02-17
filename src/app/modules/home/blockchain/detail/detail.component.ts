import { Component, OnInit } from '@angular/core';
import { IddockService } from '../../../shared/services/iddock.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
    id: string;
    type: string;
    data: any;
    hash: string;
    constructor(private router: Router, private route: ActivatedRoute, private iddockServ: IddockService) { }
    ngOnInit() {
      this.type = this.route.snapshot.paramMap.get('type');
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('thisid=', this.id);
      this.iddockServ.getDetail(this.type, this.id).subscribe(
        (ret: any) => {
          console.log('rettttt=', ret);
          if(ret && ret.ok) {
            this.data = ret._body;
            const owner = this.data.owner;
            this.iddockServ.getHashByAccount(owner, this.data._id).subscribe(
              (res: any) => {
                this.hash = res.hash;
              }
            );
          }
        }
      );
    } 
    
    history(type: string, item: any) {
      this.router.navigate(['/blockchain/history/' + type + '/' + this.id]);
    }
  


    update(type: string, item: any) {
      this.router.navigate(['/blockchain/update-info/' + type + '/' + this.id]);
    }       
}