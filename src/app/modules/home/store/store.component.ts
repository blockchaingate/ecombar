import { Component, OnInit } from '@angular/core';
import { MainLayoutService } from '../../shared/services/mainlayout.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  id: string;
  mainLayouts: any;

  constructor(
    private mainLayoutServ: MainLayoutService,
    private route: ActivatedRoute
    ) {

  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.mainLayoutServ.getMerchantMainLayouts(this.id).subscribe(
      (res:any) => {
        console.log('resss=', res);
        if(res.ok) {
          this.mainLayouts = res._body;
          console.log('this.mainLayouts=', this.mainLayouts);
          
        }
      }
    );
  }
}