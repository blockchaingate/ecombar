import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create',
    templateUrl: './collection-assets-create.component.html',
    styleUrls: ['./collection-assets-create.component.scss']
  })
  export class NftCollectionAssetsCreateComponent implements OnInit {
    propertiesModal = {
      type: 'properties',
      title: 'Add Properties',
      subtitle: 'Properties show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.'
    };

    levelsModal = {
      type: 'levels',
      title: 'Add Levels',
      subtitle: 'Levels show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.'
    };

    statsModal = {
      type: 'levels',
      title: 'Add Stats',
      subtitle: 'Stats show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.'
    };

    ngOnInit() {
          
    }
    createAssets() {
      
    }
  }
