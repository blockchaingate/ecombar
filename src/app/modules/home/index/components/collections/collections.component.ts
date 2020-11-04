import { Component, OnInit } from '@angular/core';

import { CollectionService } from '../../../../shared/services/collection.service';

@Component({
  selector: 'app-collections',
  providers: [CollectionService],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  collections: [];
  errMsg = '';

  constructor(
    private collectionServ: CollectionService) {

  }

  ngOnInit() {
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

  }

}
