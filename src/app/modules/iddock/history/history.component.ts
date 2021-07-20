import { Component, OnInit } from '@angular/core';
import { IddockService } from '../../shared/services/iddock.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
    id: string;
    type: string;
    data: any;
    hash: string;
    constructor(private router: Router, private route: ActivatedRoute, private iddockServ: IddockService) { }
    ngOnInit() {
      this.type = this.route.snapshot.paramMap.get('type');
      this.id = this.route.snapshot.paramMap.get('id');
      console.log('thisid=', this.id);
      this.iddockServ.getHistory(this.type, this.id).subscribe(
        (ret: any) => {
          console.log('rettttt=', ret);
          if(ret && ret.ok) {
            this.data = ret._body;
          }
        }
      );
    }   
    
    update(type: string, item: any) {
      this.router.navigate(['/iddock/update-info/' + type + '/' + this.id]);
    }
  
    detail(type: string, item: any) {
      this.router.navigate(['/iddock/detail/' + type + '/' + this.id]);
    }    
}