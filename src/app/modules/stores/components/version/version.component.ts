import { Component, OnInit } from '@angular/core';
import { constants } from '../../../../../environments/constants';
@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {
  version = constants.version;
  constructor() { }

  ngOnInit(): void {

  }

}
