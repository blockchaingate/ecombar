import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentService } from '../../../shared/services/comment.service';
import { PasswordModalComponent } from '../../../shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanService } from '../../../shared/services/kanban.service';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-comment',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{
    rating: number;
    comment: string;
    modalRef: BsModalRef;
    productId: string;
    commentId: string;
    wallet: any;
    
    public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}
    constructor(
      private kanbanServ: KanbanService,
      private dataServ: DataService,
      private modalService: BsModalService,
      private commentServ: CommentService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      );
      this.productId = this.route.snapshot.paramMap.get('productId');
      this.rating = 0;
      this.comment = '';
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          if(walletAddress) {
            this.commentServ.getMyCommentFor(walletAddress, this.productId).subscribe(
              (res: any) => {
                console.log('resssss=', res);
                if(res && res.ok) {
                  const commentObjs = res._body;
                  if(commentObjs && (commentObjs.length > 0)) {
                    const commentObj = commentObjs[0];
                    this.rating = commentObj.rating;
                    this.comment = commentObj.comment;
                    this.commentId = commentObj._id;
                  }
      
                }
              }
            );
          }

        }
      );

    }

    update() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
        this.updateDo(privateKey);
      });
    }

    updateDo(privateKey: any) {
      const data = {
        parentId: this.productId,
        comment: this.comment,
        rating: this.rating   
      };
      const sig = this.kanbanServ.signJsonData(privateKey, data);
      data['sig'] = sig.signature;  
      
      console.log('(this.commentId==', this.commentId);
      if(this.commentId) {
        this.commentServ.update(this.commentId, data).subscribe(
          (res) => {
            if(res && res.ok) {
              console.log('update comment successfully');
            }
          }
        );          
      } else {
        this.commentServ.create(data).subscribe(
          (res) => {
            if(res && res.ok) {
              console.log('add comment successfully');
            }
          }
        );  
      }
    
    }
}