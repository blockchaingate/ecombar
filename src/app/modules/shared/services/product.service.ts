import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpService) { }

  create(data: Product) {
    return this.http.post('products/Create', data, false);
  }

  update(id: string, data: Product) {
    return this.http.put('products/Update/' + id, data, false);
  }

  getProduct(id: string) {
    return this.http.get('products/' + id, false);
  }

  getRelatedProducts(id: string) {
    return this.http.get('products/' + id + '/related-products', false);
  }

  getProducts() {
    return this.http.get('products', false);
  }

  getMerchantProducts(merchantId: string) {
    console.log('merchantId in here', merchantId);
    return this.http.get('products/merchant/' + merchantId, true);
  }

  getProductsOwnedBy(address: string){
    return this.http.get('products/ownedBy/' + address, false);
  }
  
  deleteProduct(id: string) {
    return this.http.delete('products/delete/' + id, true);
  }

  getMerchantAllProducts() {
    return this.http.get('products/merchant/all/products', true);
  }

  getCategoryProducts(category_id: string) {
    return this.http.get('products/category/' + category_id, false);
  }

  search(searchText, categoryId, merchantId) {
    const data = {
      searchText, categoryId, merchantId
    };
    return this.http.post('products/search', data, false);
  }

  customSearch(categoryId, brands, colors, prices) {
    const data = {
      categoryId, brands, colors, prices
    };
    return this.http.post('products/search', data, false);
  }

  getAdminHotCategories() {
    return this.http.get('product-categories/admin/hot', false);
  }

  getMerchantHotCategories(merchant_id: string) {
    return this.http.get('product-categories/merchant/' + merchant_id + '/hot', false);
  }  
}