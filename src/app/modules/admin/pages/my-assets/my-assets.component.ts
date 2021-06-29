import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { AuthService } from '../../../shared/services/auth.service';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { CommentService } from '../../../shared/services/comment.service';


@Component({
  selector: 'app-admin-my-assets',
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService],
  templateUrl: './my-assets.component.html',
  styleUrls: ['./my-assets.component.scss']
})
export class MyAssetsComponent implements OnInit{
   constructor(
      private userServ: UserService,
      private authServ: AuthService,
      private commentServ: CommentService,
      private route: ActivatedRoute,
      private router: Router) {
    }

    ngOnInit() {


    }

}