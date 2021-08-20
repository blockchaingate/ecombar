import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/modules/shared/services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  order: any;
  id: string;

  constructor(private route: ActivatedRoute, private orderServ: OrderService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.orderServ.get(this.id).subscribe(
      (res: any) => {
        if (res && res.ok) {
          this.order = res._body;
          console.log('this.order=', this.order);
        }
      });
  }
}
