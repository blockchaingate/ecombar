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
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 1',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 2',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 3',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        },
        {
          medias: [
            '/assets/images/test/91215_lhpvt_a91.jpeg',
            '/assets/images/test/76105_b4quj_a91.jpeg',
            '/assets/images/test/627_b4r7b_a91.jpeg'
          ],
          name: 'product 4',
          price: 22,
          currency: 'CAD',
          sell_qty: 1
        }                        
      ]
    }
  ];
}
