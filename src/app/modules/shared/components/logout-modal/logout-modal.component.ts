import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-logout-modal',
    templateUrl: './logout-modal.component.html',
    styleUrls: ['./logout-modal.component.scss']
  })
  export class LogoutModalComponent implements OnInit{
      public onClose: Subject<string>;
      constructor(private bsModalRef: BsModalRef) {}
      ngOnInit() {
        this.onClose = new Subject();
      }

      close() {
        this.bsModalRef.hide();
      }     
      
      confirm() {
        this.onClose.next('DELETE');
        this.bsModalRef.hide();
      }
  }