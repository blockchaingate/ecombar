import { Component, Input,Output,EventEmitter } from '@angular/core';
@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: []
})
export class StarRatingComponent {
  @Input() readonly: boolean;
  @Input() rating: number;

  @Output() ratingChange = new EventEmitter<number>();
  
  constructor() {
  }
  changeRating(rating: number) {
      this.rating = rating;
      this.ratingChange.emit(this.rating);
  }
}
