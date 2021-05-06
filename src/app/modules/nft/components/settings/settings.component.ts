import { Component, OnInit } from '@angular/core';

@Component({
    providers: [],
    selector: 'app-nft-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
  })
  export class NftSettingsComponent implements OnInit {
      username: string;
      bio: string;
      email: string;
      ngOnInit() {
          
      }

      save() {

      }
  }
