import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/modules/shared/services/category.service';
import { ProductService } from 'src/app/modules/shared/services/product.service';
import {ActivatedRoute, Router, ParamMap} from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import {CategoryComponent as ParentCategoryComponent} from 'src/app/modules/store/category/category.component';

@Component({
  selector: 'app-category2',
  templateUrl: './category2.component.html',
  styleUrls: ['./category2.component.css']
})

export class Category2Component extends ParentCategoryComponent{}
