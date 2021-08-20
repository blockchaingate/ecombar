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


  }

  switchTab(i){
    console.log("switchTab function: "+ i);
    this.activeTab = i;
  }

}
