import { Component, OnInit } from '@angular/core';
import { StoreComponent as ParentStoreComponent } from 'src/app/modules/store/store/store.component';
@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent extends ParentStoreComponent{}