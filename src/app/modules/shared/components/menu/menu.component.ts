
// 复制来自 modules/theme/default/menu，原有先弃用

import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-menu-2',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent_2 extends Component{    // 我是新的 MenuComponent
    @Input() storeId: string;
    @Input() categories: any;
}