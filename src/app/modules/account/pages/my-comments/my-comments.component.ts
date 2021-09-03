import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentService } from 'src/app/modules/shared/services/comment.service';
import { DataService } from 'src/app/modules/shared/services/data.service';


@Component({
  selector: 'app-admin-my-comments',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.scss']
})
export class MyCommentsComponent implements OnInit{
    comments: any;
    public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}
    constructor(
      private dataServ: DataService,
      private commentServ: CommentService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {
      this.dataServ.currentWalletAddress.subscribe(
        (walletAddress: string) => {
          if(walletAddress) {
            this.commentServ.getMyComments(walletAddress).subscribe(
              (res: any) => {
                console.log('resssss=', res);
                if(res && res.ok) {
                   this.comments = res._body; 
                }
              }
            );
          }
        }
      );

    }

    deleteComment(comment) {
      this.commentServ.deleteComment(comment._id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.comments = this.comments.filter((item) => item._id != comment._id);
          }
        }
      );  
    }

    editComment(comment) {
      this.router.navigate(['/admin/comment/' + comment.parentId._id]);
    }
}