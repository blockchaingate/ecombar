import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { PlaceOrderComponent as ParentPlaceOrderComponent } from 'src/app/modules/store/place-order/place-order.component';
@Component({
  selector: 'app-place-order',
  providers: [UserService],
  templateUrl: './place-order.component.html',
  
})

export class PlaceOrderComponent extends ParentPlaceOrderComponent{}
