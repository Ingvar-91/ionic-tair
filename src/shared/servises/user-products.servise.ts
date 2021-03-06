import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Api} from '../core/api';
import {Observable} from "../../../node_modules/rxjs";

@Injectable()
export class UserProductsService extends Api {

  private actionName = 'user-products';

  constructor(
      protected httpClient: HttpClient
  ) {
    super(httpClient);
  }

  /* получить все магазины юзера */
  getUserProducts(shop_id: number, pageNum: number): Observable<any> {
    return this.get(`${this.actionName}/getUserProducts?shop_id=${shop_id}&page=${pageNum}`, this.headersAuth());
  }

  getUserProduct(product_id: number) {
    return this.get(`${this.actionName}/getUserProduct?product_id=${product_id}`, this.headersAuth());
  }

  getCharsProduct(category_id: number | string) {
    return this.get(`${this.actionName}/getCharsProduct?category_id=${category_id}`, this.headersAuth());
  }

  removeImageProduct(fileName: string) {
    return this.remove(`${this.actionName}/removeImageProduct?fileName=${fileName}`, this.headersAuth());
  }

  addImageProduct(formData: FormData){
    return this.post(`${this.actionName}/addImageProduct`, formData, this.headersAuth());
  }

  addProduct(productData){
    return this.post(`${this.actionName}/addProduct`, productData, this.headersAuth());
  }

  editProduct(productData){
    return this.post(`${this.actionName}/editProduct`, productData, this.headersAuth());
  }

  getCategories() {
    return this.get(`${this.actionName}/getCategories`, this.headersAuth());
  }

  removeProduct(product_id: number, shop_id: number) {
    return this.remove(`${this.actionName}/removeProduct?product_id=${product_id}&shop_id=${shop_id}`, this.headersAuth());
  }

}
