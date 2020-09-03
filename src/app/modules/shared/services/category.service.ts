import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  token: string;

  constructor(private apiServ: ApiService) {
  }
  
  create(data) {    
    return this.apiServ.postPrivate('cats/create', data);
  }
  
  getCategories() {
    return this.apiServ.postPublic('cats', {typ: environment.cat_typ});
  }

}