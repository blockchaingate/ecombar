import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';

@Injectable()
export class PaymentService {
    constructor(private http: HttpService) { }

    checkPaymentStatus(code: string) {
        const url = 'payment/gateway/' + code;
        return this.http.get(url, true);
    }

}