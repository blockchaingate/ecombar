import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../shared/services/comment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
   @Input() comments: any;
   @Input() overall: number;
   @Input() rating5: number;
   @Input() rating4: number;
   @Input() rating3: number;
   @Input() rating2: number;
   @Input() rating1: number;

  constructor(private route: ActivatedRoute, private commentServ: CommentService) { }

  ngOnInit() {

  }
}
