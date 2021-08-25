import { Component } from '@angular/core';
import { ActivateComponent as ParentActivateComponent} from '../../active/activate.component';
@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent extends  ParentActivateComponent{

}