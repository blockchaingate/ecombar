import { Component, OnInit } from '@angular/core';
import { IddockService } from '../../../shared/services/iddock.service';
import {ActivatedRoute} from '@angular/router';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'app-detail-by-sequence-id',
  templateUrl: './detail-by-sequence-id.component.html',
  styleUrls: ['./detail-by-sequence-id.component.scss']
})
export class DetailBySequenceIDComponent implements OnInit {
    id: string;
    type: string;
    data: any;
    hash: string;
    baseUrl: string;
    constructor(private route: ActivatedRoute, private iddockServ: IddockService) { }
    ngOnInit() {
      this.baseUrl = environment.endpoints.website;
      this.type = this.route.snapshot.paramMap.get('type');
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('thisid=', this.id);

      /*
      this.iddockServ.getDetail(this.type, this.id).subscribe(
        (ret: any) => {
          console.log('rettttt=', ret);
          if(ret && ret.ok) {
            this.data = ret._body;
            const owner = this.data.owner;

          }
        }
      );
      */

     this.iddockServ.getHashByAccount(this.type, this.id).subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.data = ret._body;
        }
      }
    );      
    }    
}