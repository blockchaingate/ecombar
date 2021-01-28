import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';

@Component({
  selector: 'app-admin-main-layout',
  providers: [CollectionService],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss', '../../../../../table.scss']
})
export class MainLayoutComponent implements OnInit {
    mainLayouts: any;
    ngOnInit() {

    }
}