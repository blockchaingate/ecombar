import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../shared/services/blog.service';
import { DataService } from '../../shared/services/data.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  @Input() slug: string;
  blog: any;
  constructor(
    private route: ActivatedRoute,
    private dataServ: DataService,
    private blogServ: BlogService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe()
    this.dataServ.currentStoreOwner.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.blogServ.getBlogBySlug(walletAddress, this.slug).subscribe(
            (ret: any) => {
              if(ret && ret.ok) {
                this.blog = ret._body;
              }
            }
          );
        }
      }
    );
    
  }

}
