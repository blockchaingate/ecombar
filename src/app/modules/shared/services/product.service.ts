
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../../../environments/environment';

import { Product } from '../models/product';

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

const baseUrl = environment.endpoints['paycool'];
const madeatUrl = environment.endpoints['madeat'];

@Injectable({ providedIn: 'root' })
export class ProductService {
    constructor(private http: HttpClient) { }

    create(data: Product) {
        return this.http.post(baseUrl + 'product', data);
    }

    update(id: string, data: Product) {
        // console.log('[update] url =', baseUrl + 'product/' + id);
        // console.log('[update] data=', data);
        // 后端 router.put("/:id", ProductController.updateMerchantProduct);
        return this.http.put(baseUrl + 'product/' + id, data);
    }

    // 原有 /product/info
    getProduct(id: string) {
        return this.http.get(baseUrl + 'product/' + id);
    }
    // 现用 /product/info
    getProductInfo( id: string ) {
        return this.http.get(madeatUrl + `product/info?id=${id}`, httpOptions);
    }

    getRelatedProducts(id: string) {
        return this.http.get('products/' + id + '/related-products');
    }

    getProducts() {
        return this.http.get('products');
    }

    getMerchantProducts(merchantId: string, pageSize: number, pageNum: number) {
        console.log('merchantId in here', merchantId);
        return this.http.get(baseUrl + 'product/merchant/' + merchantId + '/' + pageSize + '/' + pageNum);
    }

    // 原有 /product/list
    getProductsOwnedBy(address: string, pageSize: number, pageNum: number){
        return this.http.get(baseUrl + 'product/owner/' + address + '/' + pageSize + '/' + pageNum);
    }
    // 现用 /product/list
    getProductList() {    // 东西不多，不用 skip/limit
        return this.http.get(madeatUrl + 'product/list', httpOptions);
    }
    
    deleteProduct(id: string) {
        return this.http.delete('products/delete/' + id);
    }

    // 原有 /product/delete
    deleteProduct2( body: any ) {
        return this.http.post(baseUrl + 'product/delete', body);
    }
    // 现用 /product/delete
    removeProduct( id: string ) {
        return this.http.post(madeatUrl + `product/delete?id=${id}`, httpOptions);
    }

    getMerchantAllProducts() {
        return this.http.get('products/merchant/all/products');
    }

    getCategoryProducts(category_id: string) {
        return this.http.get('products/category/' + category_id);
    }

    search(searchText, categoryId, owner) {
        const data = {
        searchText, categoryId, owner
        };
        return this.http.post('products/search', data);
    }

    customSearch(categoryId, brands, colors, prices) {
        const data = {
        categoryId, brands, colors, prices
        };
        return this.http.post('products/search', data);
    }

    getAdminHotCategories() {
        return this.http.get('product-categories/admin/hot');
    }
}