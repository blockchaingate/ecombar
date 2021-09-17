import { Component, OnInit } from '@angular/core';
import { HeaderComponent as ParentHeaderComponent } from 'src/app/modules/store/layout/header/header.component';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ParentHeaderComponent{}