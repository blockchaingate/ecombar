import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  constructor(private http: HttpService) { }

  create(data) {
    return this.http.post('newsletter/Create', data, false);
  }

  getMerchantNewsletters(walletAddress: string) {
    return this.http.get('newsletter/merchant/' + walletAddress, false);
  }

  deleteNewsletter(data: any) {
    return this.http.post('newsletter/Delete', data, false);
  }
}