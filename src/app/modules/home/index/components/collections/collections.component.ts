import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../../shared/services/collection.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-collections',
  providers: [CollectionService],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  storeId: string;
  collections: [];
  errMsg = '';

  constructor(private route: ActivatedRoute, private collectionServ: CollectionService) { }

  ngOnInit() {
    this.storeId = this.route.snapshot.paramMap.get('id');
    console.log('this.storeId=', this.storeId);
    if(!this.storeId) {
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
    } else {
      this.collectionServ.getCollectionsForStore(this.storeId).subscribe(
        (res: any) => {
          console.log('res for getCollections', res);
          if (res && res.ok) {
            this.collections = res._body;
            console.log('this.collections==', this.collections);
          }
        },
        error => { this.errMsg = error.message; }
      );      
    }


  }

}
