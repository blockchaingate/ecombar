import { Component, OnInit } from '@angular/core';
import { FooterComponent as ParentFooterComponent} from 'src/app/modules/store/layout/footer/footer.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent extends ParentFooterComponent{}
