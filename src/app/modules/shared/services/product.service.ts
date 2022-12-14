import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Product } from '../models/product';
import { HttpClient } from '@angular/common/http';
const baseUrl = environment.endpoints.paycool;

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) { }

  create(data: Product) {
    return this.http.post('products/Create', data);
  }

  update(id: string, data: Product) {
    return this.http.put('products/Update/' + id, data);
  }

  getProduct(id: string) {
    return this.http.get('products/' + id);
  }

  getRelatedProducts(id: string) {
    return this.http.get('products/' + id + '/related-products');
  }

  getProducts() {
    return this.http.get('products');
  }

  getMerchantProducts(merchantId: string) {
    console.log('merchantId in here', merchantId);
    return this.http.get('products/merchant/' + merchantId);
  }

  getProductsOwnedBy(address: string, pageSize: number, pageNum: number){
    return this.http.get('products/owner/' + address + '/' + pageSize + '/' + pageNum);
  }
  
  deleteProduct(id: string) {
    return this.http.delete('products/delete/' + id);
  }

  deleteProduct2(body: any) {
    return this.http.post('products/Delete2', body);
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

  getMerchantHotCategories(merchant_id: string) {
    return this.http.get('product-categories/merchant/' + merchant_id + '/hot');
  }  
}