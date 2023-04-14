import { Pipe, PipeTransform } from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Pipe({name: 'translateField', pure: false})
export class TranslateFieldPipe extends TranslatePipe implements PipeTransform {
    constructor(private translateServ: TranslateService) {
        super(translateServ,null);
    }
    // Fix: error TS4114: This member must have an 'override' modifier because it overrides a member in the base class 'TranslatePipe'.
    override transform( fieldName: any): any {
        if(!fieldName) {
            return '';
        }
        const lang = this.translateServ.getDefaultLang();
        if(Array.isArray(fieldName)) {
            const field = fieldName.filter(item => item.lan == lang);
            if(field && field.length > 0) {
                return field[0].text;
            }
        } else 
        if(fieldName[lang] != undefined) {
            return fieldName[lang];
        } else 
        if(fieldName['en']) {
            return fieldName['en'];
        } else 
        if(fieldName['sc']) {
            return fieldName['sc'];
        }
        return fieldName;
    }
}