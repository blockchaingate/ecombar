import { Component, OnInit } from '@angular/core';
import { TrackOrderComponent as ParentTrackOrderComponent } from 'src/app/modules/store/track-order/track-order.component';
@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.css']
})
export class TrackOrderComponent extends ParentTrackOrderComponent{}
