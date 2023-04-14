import { Component, OnInit, Input } from '@angular/core';
import { BlogService } from 'src/app/modules/shared/services/blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { PasswordModalComponent } from 'src/app/modules/shared/components/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-blog-add',
  templateUrl: './blog-add.component.html',
  
})
export class BlogAddComponent implements OnInit {
  @Input() slug: string;
  public insertImageSettings :ImageSettingsModel = { allowedTypes: ['.jpeg', '.jpg', '.png'], display: 'inline', width: 'auto', height: 'auto', saveFormat: 'Blob', saveUrl: null, path: null,}
  modalRef: BsModalRef;
  wallet: any;  
  title: string;
  titleChinese: string;
  content: string;
  contentChinese: string;
  currentTab: string;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public kanbanServ: KanbanService,
    private dataServ: DataService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private blogServ: BlogService) {
  }

  ngOnInit() {
    this.content = '';
    this.contentChinese = '';
    this.currentTab = 'default English';
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        if(walletAddress) {
          this.blogServ.getBlogBySlug(walletAddress, this.slug).subscribe(
            (res: any) => {
              if (res && res.ok) {
                const blog = res._body;
                if(blog) {
                  console.log('blog=', blog);
                  if(blog.title) {
                    this.title = blog.title[0].text;
                    this.titleChinese = blog.title[1].text;
                  }
                  if(blog.content) {
                    this.content = blog.content[0].text;
                    this.contentChinese = blog.content[1].text; 
                  }

                }
              
              }
    
            }
        );
        }
      }
    );

  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addBlog() {

    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onCloseFabPrivateKey.subscribe( async (privateKey: any) => {
      this.addBlogDo(privateKey);
    });
  }

  addBlogDo(privateKey: any) {

    const title = [
      {
        lan: 'en',
        text: this.title
      },
      {
        lan: 'sc',
        text: this.titleChinese
      }
    ];    
    const content = [
      {
        lan: 'en',
        text: this.content
      },
      {
        lan: 'sc',
        text: this.contentChinese
      }
    ];     
    const data = {
      title: title,
      content: content,
      slug: this.slug
    };
    
    const sig = this.kanbanServ.signJsonData(privateKey, data);
    data['sig'] = sig.signature;   
    if (!this.id) {

      this.blogServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.toastr.success( this.slug + ' was added');
          }
        }
      );
    } else {
      this.blogServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.toastr.success( this.slug + ' was updated');
          }
        }
      );
    }

  }
}
