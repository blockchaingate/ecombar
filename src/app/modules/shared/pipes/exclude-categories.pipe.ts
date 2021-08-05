import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'excludeCategories'})
export class ExcludeCategoriesPipe implements PipeTransform {
    transform( arr: any, excludedId: string): any {
        if(!excludedId) {
            return arr;
        }
        return arr.filter(item => item._id != excludedId);
    }
}