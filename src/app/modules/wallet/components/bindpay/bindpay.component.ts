import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from 'src/app/modules/shared/services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wallet-bindpay',
  providers: [],
  templateUrl: './bindpay.component.html',
  styleUrls: ['./bindpay.component.scss']
})
export class BindpayComponent implements OnInit{
    modalRef: BsModalRef;
    wallet: any;
    name: string;
    to: string;
    data: string;

    constructor(    
        private kanbanSmartContractServ: KanbanSmartContractService,
        private dataServ: DataService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        public kanbanServ: KanbanService,
        private modalService: BsModalService,) {}
    ngOnInit() {
        this.dataServ.currentWallet.subscribe(
            (wallet: string) => {
              this.wallet = wallet;
            }
        ); 

        this.route.queryParams.subscribe(params => {
            this.name = params['name'];
            this.to = params['to'];
            this.data = params['data'];
        });
    }

    submit() {
        const initialState = {
            pwdHash: this.wallet.pwdHash,
            encryptedSeed: this.wallet.encryptedSeed
        };          
          
        this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
      
        this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
            this.submitDo(seed);
        });        
    }

    async submitDo(seed: Buffer) {
        const ret = await this.kanbanSmartContractServ.execSmartContractWithData(seed, this.to, this.data);
        if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
            this.toastr.success('the transaction was procssed successfully');
        } else {
            this.toastr.error('Failed to process the transaction');
        }
    }

}