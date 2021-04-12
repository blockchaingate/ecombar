import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create',
    templateUrl: './collection-assets-create.component.html',
    styleUrls: ['./collection-assets-create.component.scss']
  })
  export class NftCollectionAssetsCreateComponent implements OnInit {
    name: string;

    properties: any;

    propertiesModal = {
      type: 'properties',
      title: 'Add Properties',
      subtitle: 'Properties show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
      data: [
        {
          type: "aaa",
          name: "ooo"
        }
      ]
    };

    levelsModal = {
      type: 'levels',
      title: 'Add Levels',
      subtitle: 'Levels show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
      data: []
    };

    statsModal = {
      type: 'levels',
      title: 'Add Stats',
      subtitle: 'Stats show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
      data: []
    };

    constructor(private router: Router, private route: ActivatedRoute) {

    }

    saveProperties(props: any) {
      this.properties = props;
    }

    ngOnInit() {
      this.route.paramMap.subscribe((params: ParamMap) =>  {
        this.name = params.get('name');   
      });
    }
    createAssets() {
      this.router.navigate(['/nft/admin/collections/' + this.name + '/assets/create-done']);
    }
  }
