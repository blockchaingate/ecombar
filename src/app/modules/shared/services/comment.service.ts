import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private http: HttpService) {
  }

  create(data) {
    return this.http.post('comment/Create', data);
  }  

  deleteComment(id) {
    return this.http.get('comment/Delete/' + id);
  }  

  update(id: string, data) {
    return this.http.post('comment/update/' + id, data);
  }

  getMyCommentFor(productId: string) {
    return this.http.get('comment/myCommentFor/' + productId);
  }

  getComments(productId: string) {
    return this.http.get('comment/commentFor/' + productId, false);
  }

  getMyComments() {
    return this.http.get('comment/myComments');
  }
}