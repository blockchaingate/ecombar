import { Component, Input, OnInit } from '@angular/core';
import { CollectionService } from 'src/app/modules/shared/services/collection.service';

@Component({
  selector: 'app-collections2',
  templateUrl: './collections2.component.html',
  styleUrls: ['./collections2.component.css']
})
export class Collections2Component implements OnInit {

  @Input() collections: [];
  errMsg = '';
  activeTab = 0;

  constructor(private collectionServ: CollectionService) { }

  ngOnInit() {
    /*
    console.log('nggggg');
    this.collectionServ.getCollections().subscribe(
      (res: any) => {
        console.log('res for getCollections', res);
        if (res && res.ok) {
          this.collections = res._body;
          console.log('this.collections==', this.collections);
        }
      },
      error => { this.errMsg = error.message; }
    );
    */

  }

  switchTab(i){
    console.log("switchTab function: "+ i);
    this.activeTab = i;
  }

}
