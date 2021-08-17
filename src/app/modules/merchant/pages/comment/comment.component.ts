import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentService } from 'src/app/modules/shared/services/comment.service';


@Component({
  selector: 'app-admin-comment',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit{
    rating: number;
    comment: string;
    productId: string;
    commentId: string;
    public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}
    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private commentServ: CommentService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.productId = this.route.snapshot.paramMap.get('productId');
      this.rating = 0;
      this.comment = '';
      this.commentServ.getMyCommentFor(this.productId).subscribe(
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

    update() {
      const data = {
        parentId: this.productId,
        comment: this.comment,
        rating: this.rating   
      };
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