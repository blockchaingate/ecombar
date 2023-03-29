
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {

  constructor() { }
  // - We set the initial state in BehaviorSubject's constructor
  // - Nobody outside the Store should have access to the BehaviorSubject 
  //   because it has the write rights
  // - Writing to state should be handled by specialized Store methods (ex: addTodo, removeTodo, etc)
  // - Create one BehaviorSubject per store entity, for example if you have TodoGroups
  //   create a new BehaviorSubject for it, as well as the observable$, and getters/setters
  private readonly _items = new BehaviorSubject<CartItem[]>([]);

  // Expose the observable$ part of the _todos subject (read only stream)
  readonly items$ = this._items.asObservable();


  // the getter will return the last value emitted in _todos subject
  get items(): CartItem[] {
    return JSON.parse(localStorage.getItem('cartItems'));
  }

  // assigning a value to this.todos will push it onto the observable 
  // and down to all of its subsribers (ex: this.todos = [])
  set items(val: CartItem[]) {
    this._items.next(val);
  }

  addCartItem(item: CartItem) {
    console.log('item to be added there we go=', item);
    console.log('items before added', this.items);
    // we assaign a new copy of todos by adding a new todo to it 
    // with automatically assigned ID ( don't do this at home, use uuid() )
    let existed = false;

    let items = this.items;
    if (this.items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].productId === item.productId) {
          console.log('this.items[i].quantity', this.items[i].quantity);
          console.log('item.quantity', item.quantity);
          items[i].quantity = item.quantity + this.items[i].quantity;
          console.log('this.items[i].quantity2', this.items[i].quantity);
          console.log('this.items in middle', this.items);
          existed = true;
          console.log('existed=true');
        }
      }

      if (!existed) {
        console.log('not existed');
        items.push(item);
        console.log('after push', this.items);
      }
    } else {
      items = [item];
    }

    localStorage.setItem('cartItems', JSON.stringify(items));
    this._items.next(this.items);
  }

  saveCartItems(items) {
    localStorage.setItem('cartItems', JSON.stringify(items));
    this._items.next(this.items);
  }

  empty() {
    return this.saveCartItems([]);
  }

    // 购物车有对应台号

    getTableNo(): number {
        return parseInt( localStorage.getItem('tableNo') );
    }

    setTableNo( no: number ) {
        localStorage.setItem('tableNo', no.toString());
    }

    // 购物车有对应订单

    getOrderId(): string {
        return localStorage.getItem('orderId');
    }

    setOrderId( orderId: string ) {
        localStorage.setItem('orderId', orderId);
    }

}
