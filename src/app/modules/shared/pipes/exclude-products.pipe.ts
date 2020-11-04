import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'excludeProducts'})
export class ExcludeProductsPipe implements PipeTransform {
    transform( arr: any, excludedArr: any): any {
        console.log('arr=', arr);
        if(!excludedArr) {
            return arr;
        }
        const newArr = [];
        if(!arr) {
            return [];
        }
        console.log('this.images6');
        for(let i=0;i<arr.length;i++) {
            const item = arr[i];
            let included = false;
            for(let j=0;j<excludedArr.length;j++) {
                const item2 = excludedArr[j];
                if(item2._id == item._id) {
                    included = true;
                }
            }
            if(!included) {
                newArr.push(item);
            }
        }
        return newArr;
    }
}