// src/app/auth/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {TranslateService as TranService} from '@ngx-translate/core';
import { ElementSchemaRegistry } from '@angular/compiler';

@Injectable()
export class TranslateService {
    constructor(private tranServ: TranService) {
    }
    transField(fieldName: any) {
        if(!fieldName) {
            return '';
        }
        const lang = this.tranServ.currentLang;
        let transalted = fieldName[lang];
        if(!transalted) {
            if(fieldName['sc']) {
                transalted = fieldName['sc'];
            } else
            if(fieldName['en']) {
                transalted = fieldName['en'];
            }
        }
        return transalted;
    }   
    getLang() {
        const lang = this.tranServ.currentLang;
        return lang;
    }     
}