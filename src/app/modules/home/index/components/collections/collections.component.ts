import { Component } from '@angular/core';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent {
  collections = [
    {
      name: 'Hot sales',
      items: [
        {
          image: '',
          name: '',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          image: '',
          name: '',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          image: '',
          name: '',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          image: '',
          name: '',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        }                        
      ]
    }
  ];
}
