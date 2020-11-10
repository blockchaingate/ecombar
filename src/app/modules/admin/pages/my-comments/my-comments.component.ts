import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentService } from '../../../shared/services/comment.service';


@Component({
  selector: 'app-admin-my-comments',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './my-comments.component.html',
  styleUrls: ['./my-comments.component.scss', '../../../../../table.scss', '../../../../../button.scss']
})
export class MyCommentsComponent implements OnInit{
    comments: any;
    public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}
    constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private commentServ: CommentService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {

      this.commentServ.getMyComments().subscribe(
        (res: any) => {
          console.log('resssss=', res);
          if(res && res.ok) {
             this.comments = res._body; 
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