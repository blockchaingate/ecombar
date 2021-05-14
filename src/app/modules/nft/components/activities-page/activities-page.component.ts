import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NftCollectionService } from '../../services/nft-collection.service';
import { NftEventService } from '../../services/nft-event.service';

@Component({
    providers: [],
    selector: 'app-nft-activities-page',
    templateUrl: './activities-page.component.html',
    styleUrls: ['./activities-page.component.scss']
  })
  export class NftActivitiesPageComponent implements OnInit {
      events: any;
      collections: any;
      selectedCollections: any;
      selectedEventTypes: any;

      options = {
        expanded: true
      }   

      constructor(
          private collectionServ: NftCollectionService,
          private eventServ: NftEventService) {}
      ngOnInit() {
        this.selectedCollections = [];
        this.selectedEventTypes = [];
        this.eventServ.getAll().subscribe(
            (ret: any) => {
                if(ret && ret.ok) {
                    const body = ret._body;
                    this.events = body;
                }
            }
        ); 
        
        this.collectionServ.getAll().subscribe(
            (ret: any) => {
                if(ret && ret.ok) {
                    this.collections = ret._body;
                    console.log('this.collections=', this.collections);
                }
            }
        );       
      }
  }