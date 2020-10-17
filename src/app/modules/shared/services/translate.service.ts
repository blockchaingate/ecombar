// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TranslateService as TranService} from '@ngx-translate/core';

@Injectable()
export class TranslateService {
    constructor(private tranServ: TranService) {
    }
    transField(fieldName: any) {
        const lang = this.tranServ.getDefaultLang();
        return fieldName[lang];
    }        
}