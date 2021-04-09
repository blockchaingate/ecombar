import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { NftCollectionService } from '../../services/nft-collection.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
    providers: [],
    selector: 'app-nft-collections',
    templateUrl: './collections.component.html',
    styleUrls: ['./collections.component.scss']
  })
  export class NftCollectionsComponent implements OnInit {
    modalRef: BsModalRef;
    address: string;
    collection: any;
    collections: any;
    constructor(
      private localSt: LocalStorage,
      private collectionServ: NftCollectionService,
      private router: Router,
      private modalService: BsModalService) {}
 
   
    ngOnInit() {
        this.address = '';
        this.collections = [];

        this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

          if(!wallets || (wallets.length == 0)) {
            return;
          }
          const wallet = wallets.items[wallets.currentIndex];
          const addresses = wallet.addresses;
          this.address = addresses.filter(item => item.name == 'FAB')[0].address;
          console.log('this.address=', this.address);
          this.collectionServ.getByAddress(this.address).subscribe(
            (res:any) => {
              if(res && res.ok) {
                this.collections = res.data;
              }
            }
          );
        });        
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template);
    } 

    createCollection(event, templateDone) {
        console.log('event in createCollection=', event);
        const collection = {
          name: event.name,
          description: event.description,
          image: event.image,
          address: this.address
        }
        this.collectionServ.create(collection).subscribe(
          (res: any) => {
            console.log('res from create collection=', res);
            if(res && res.ok) {
              this.collection = res.data;
              this.collections.push(this.collection);
              this.modalRef.hide();
              this.modalRef = this.modalService.show(templateDone);
            }
          }
        );

    }

    createItem(event) {
      this.modalRef.hide();
      this.router.navigate(['/nft/admin/collections/' + this.collection.slug + '/assets/create']);
    }
  }
