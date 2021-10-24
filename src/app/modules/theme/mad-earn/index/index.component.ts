import { Component, OnInit } from '@angular/core';
import  {IndexComponent as ParentIndexComponent} from '../../../store/index/index.component';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent extends ParentIndexComponent {

}
