import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MerchantService } from '../../../shared/services/merchant.service';
import { ShipService } from '../../../shared/services/ship.service';
import { OrderService } from '../../../shared/services/order.service';
import { Store } from '@ngrx/store';
import { UserState } from '../../../../store/states/user.state';
import { Role } from '../../../../config/role';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-ships',
  providers: [],
  templateUrl: './ships.component.html',
  styleUrls: ['./ships.component.scss']
})
export class ShipsComponent implements OnInit{
    modalRef: BsModalRef;
    ships: any;
    ship: any;
    canAddDetails: boolean;
    dateCreated: string;
    status: string;
    city: string;
    text: string;

    constructor(
        private modalService: BsModalService,
        private dataServ: DataService,
        private shipServ: ShipService) {
    }    
    ngOnInit() {
        this.canAddDetails = true;
        this.dataServ.currentWalletAddress.subscribe(
            (walletAddress: string) => {
                if(walletAddress) {
                    this.shipServ.getMerchantShips(walletAddress).subscribe(
                        (res: any) => {
                            if(res && res.ok) {
                                this.ships = res._body;
                            }
                        }
                    );  
                }

            }
        );

    }

    openModal(ship: any, template: TemplateRef<any>) {
        this.ship = ship;
        this.modalRef = this.modalService.show(template, {class: 'modal-lg'});
    }    

    addDetail() {
        const body = {
            dateCreated: this.dateCreated,
            status: this.status,
            city: this.city,
            text: this.text
        };
        this.shipServ.addDetail(this.ship._id, body).subscribe(
            (res:any) => {
                if(res && res.ok) {
                    this.dateCreated = '';
                    this.status = '';
                    this.city = '';
                    this.text = '';
                    this.ship = res._body;
                }
            } 
        );
    }
}