import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { NftAssetService } from '../../services/nft-asset.service';

@Component({
    providers: [],
    selector: 'app-nft-collection-assets-create',
    templateUrl: './collection-assets-create.component.html',
    styleUrls: ['./collection-assets-create.component.scss']
  })
  export class NftCollectionAssetsCreateComponent implements OnInit {
    slug: string;

    media: string;
    name: string;
    externalLink: string;
    description: string;
    properties: any;
    levels: any;
    stats: any;
    unlockableContent: string;

    propertiesModal = {
      type: 'properties',
      title: 'Add Properties',
      subtitle: 'Properties show up underneath your item, are clickable, and can be filtered in your collection\'s sidebar.',
      data: []
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

    constructor(
      private assetServ: NftAssetService,
      private router: Router, 
      private route: ActivatedRoute) {

    }

    saveProperties(props: any) {
      this.properties = props;
    }

    saveLevels(props: any) {
      this.levels = props;
    }

    saveStats(props: any) {
      this.stats = props;
    }

    ngOnInit() {
      this.route.paramMap.subscribe((params: ParamMap) =>  {
        this.slug = params.get('slug');   
      });
    }
    createAssets() {
      const asset = {
        media: this.media,
        name: this.name,
        externalLink: this.externalLink,
        description: this.description,
        properties: this.properties,
        levels: this.levels,
        stats: this.stats,
        unlockableContent: this.unlockableContent
      }

      this.assetServ.create(asset).subscribe(
        (res: any) => {
          console.log('res from create asset=', res);
          this.router.navigate(['/nft/admin/collections/' + this.slug + '/assets/create-done']);
        }
      );
      
    }
  }
