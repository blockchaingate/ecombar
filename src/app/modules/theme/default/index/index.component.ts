import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import { MainLayoutService } from 'src/app/modules/shared/services/mainlayout.service';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { Product } from 'src/app/modules/shared/models/product';
import { TopCategoryBannerService } from 'src/app/modules/shared/services/top-category-banner.service';
import  {IndexComponent as ParentIndexComponent} from '../../../store/index/index.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent extends ParentIndexComponent {

}
