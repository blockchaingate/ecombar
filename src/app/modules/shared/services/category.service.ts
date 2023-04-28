
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { CartStoreService } from 'src/app/modules/shared/services/cart.store.service';
import { environment } from '../../../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({
        'accept': 'application/json'
    })
};

const httpOptionsJson = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'accept': 'application/json'
    })
};

const baseUrl = environment.endpoints['paycool'];  // 未来取消
// const madeatUrl = environment.endpoints['madeat'];  // 随时会改

@Injectable({ providedIn: 'root' })
export class CategoryService {
    token: string;

    constructor(
        private http: HttpClient,
        private cartStoreServ: CartStoreService) { 
    }

    // 原有 /category/create
    create( data ) {
        // 后端 router.post("/", CategoryController.createMerchantCategory);
        return this.http.post(baseUrl + 'category', data);
    }
    // 现用 /category/create
    createCategory( data ) {
        const madeatUrl = this.cartStoreServ.queryApiUrl();
        // return this.http.put(madeatUrl + 'category/create', {}, { params });
        return this.http.put(madeatUrl + 'category/create', JSON.stringify(data), httpOptionsJson);
    }

    // 原有 /category/update
    update( id: string, data ) {
        // 后端 router.put("/:id", CategoryController.updateMerchantCategory);
        return this.http.put(baseUrl + 'category/' + id, data);
    }
    // 现用 /category/update
    updateCategory( data ) {
        const madeatUrl = this.cartStoreServ.queryApiUrl();
        // return this.http.put(madeatUrl + 'category/update', {}, { params });
        return this.http.put(madeatUrl + 'category/update', JSON.stringify(data), httpOptionsJson);
    }

    getCategories() {
        return this.http.get('product-categories');
    }

    getAdminCategories() {
        return this.http.get('product-categories/admin');
    }

    getAdminCategoriesWithCount() {
        return this.http.get('product-categories/admin_with_counts');
    }
    
    // 原有 /category/list
    getMerchantCategories(walletAddress: string, pageSize: number, pageNum:number) {
        return this.http.get(baseUrl + 'category/owner/' + walletAddress + '/' + pageSize + '/' + pageNum);
    }
    // 现用 /category/list
    getCategoryList() {    // 东西不多，不用 skip/limit
        const madeatUrl = this.cartStoreServ.queryApiUrl();
        return this.http.get(madeatUrl + 'category/list', httpOptions);
        // this.http.get(madeatUrl + 'category/list', httpOptions).subscribe(
        //     response => {
        //         console.log(response);
        //     },
        //     error => {
        //         console.error(error);
        //     }
        // );
    }

    getMerchantCategoriesTree(walletAddress: string) {
        return this.http.get(baseUrl + 'category/tree/owner/' + walletAddress);
    }
    
    getMerchantHotCategories(merchant_id: string, pageSize:number, pageNum:number) {
        return this.http.get(baseUrl + '/category/hot/merchant/' + merchant_id + '/' + pageSize + '/' + pageNum);
    } 

    // 原有 /category/info
    getCategory( id: string ) {
        return this.http.get(baseUrl + 'category/' + id);
    }
    // 现用 /category/info
    getCategoryInfo( id: string ) {
        const madeatUrl = this.cartStoreServ.queryApiUrl();
        return this.http.get(madeatUrl + `category/info?id=${id}`, httpOptions);
    }

    // 原有 /category/delete
    // deleteCategory( data: any ) {  // 后端缺此方法
    //     return this.http.post('product-categories/Delete', data);
    // }
    // 现用 /category/delete
    deleteCategory( id: string ) {
        const madeatUrl = this.cartStoreServ.queryApiUrl();
        return this.http.delete(madeatUrl + `category/delete?id=${id}`, httpOptions);
    }
}
