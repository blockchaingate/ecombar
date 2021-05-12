import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NftEventService } from '../../services/nft-event.service';

@Component({
    providers: [],
    selector: 'app-nft-account-activity',
    templateUrl: './account-activity.component.html',
    styleUrls: ['./account-activity.component.scss']
  })
  export class NftAccountActivityComponent implements OnInit {
    @Input() collections: any;
    @Input() address: string;
    selectedCollections: any;
    selectedEventTypes: any;

    events: any;
    options = {
        expanded: true
    }    

    constructor(private eventServ: NftEventService) {}
    ngOnInit() {
      this.selectedCollections = [];
      this.selectedEventTypes = [];

      if(this.address) {
        this.eventServ.getAllByAddress(this.address).subscribe(
          (ret: any) => {
            if(ret && ret.ok) {
              const body = ret._body;
              this.events = body;
              console.log('this.events=', this.events);
            }
          }
        ); 
      } else {
        this.eventServ.getAll().subscribe(
          (ret: any) => {
              if(ret && ret.ok) {
                  const body = ret._body;
                  this.events = body;
              }
          }
      );
      }
    }
  }