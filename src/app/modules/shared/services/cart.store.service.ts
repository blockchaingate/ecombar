import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {

  constructor() {
  }
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
      return this._items.getValue();
    }
  
  
    // assigning a value to this.todos will push it onto the observable 
    // and down to all of its subsribers (ex: this.todos = [])
    set items(val: CartItem[]) {
      this._items.next(val);
    }
  
    addCartItem(item: CartItem) {
      console.log('items to be added=', item);
      // we assaign a new copy of todos by adding a new todo to it 
      // with automatically assigned ID ( don't do this at home, use uuid() )
      this.items = [
        ...this.items, 
        item
      ];
    }
  
    removeTodo(_id: string) {
      this.items = this.items.filter(item => item._id !== _id);
    }
  
  
  }
