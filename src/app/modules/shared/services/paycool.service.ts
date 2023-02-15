import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

// 请见 environment.ts, environment.prod.ts
// 测试环境：https://fabtest.info/api/merchantreferral/hot
// 生产环境：https://api.pay.cool/api/merchantreferral/hot
const baseUrl = environment.endpoints.paycool;
@Injectable()
export class PaycoolService {
    
    constructor(private http: HttpClient) { }

    isValidMember(address: string) {
        const url = baseUrl + 'userreferral/isValid/' + address;
        return this.http.get(url);
    }
}
