// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TranslateService as TranService} from '@ngx-translate/core';

@Injectable()
export class TranslateService {
    constructor(private tranServ: TranService) {
    }
    transField(fieldName: any) {
        if(!fieldName) {
            return '';
        }
        const lang = this.tranServ.currentLang;
        return fieldName[lang];
    }   
    getLang() {
        const lang = this.tranServ.currentLang;
        return lang;
    }     
}