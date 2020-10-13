import { Component, OnInit } from '@angular/core';

import { CollectionService } from '../../../../shared/services/collection.service';

@Component({
  selector: 'app-collections',
  providers: [CollectionService],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {

  collections: any;

  constructor(
    private collectionServ: CollectionService) {

  }

  ngOnInit() {
    this.collectionServ.getCollections().subscribe(
      (res: any) => {
        if(res && res.ok) {
          this.collections = res._body;
          console.log('this.collections==', this.collections);
        }
      }
    );

  }

}
