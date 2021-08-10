import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class BlogService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('blogs/Create', data);
  }

  update(id: string, data) {
    return this.http.put('blogs/Update/' + id, data);
  }

  getBlogs() {
    return this.http.get('blogs', false);
  }

  getBlogBySlug(slug: string) {
    return this.http.get('blogs/slug/' + slug, false);
  }
  
  getMerchantBlogs(walletAddress: string) {
    return this.http.get('blogs/merchant/' + walletAddress, false);
  }

  getBlog(id: string) {
    return this.http.get('blogs/' + id, false);
  }

  deleteBlog(data: any) {
    return this.http.post('blogs/Delete', data);
  }
}