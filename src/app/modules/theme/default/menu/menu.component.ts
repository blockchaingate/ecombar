import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent extends Component{    // 暂时弃用 MenuComponent
    @Input() storeId: string;
    @Input() categories: any;
}