import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../shared/services/collection.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';

@Component({
  selector: 'app-admin-collection-add',
  providers: [CollectionService],
  templateUrl: './collection-add.component.html',
  styleUrls: ['./collection-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class CollectionAddComponent implements OnInit{
    sequence: number;
    name: string;
    nameChinese: string;
    currentTab: string;
    id: string;

    constructor(
      private userServ: UserService,
      private route: ActivatedRoute,
      private router: Router,
      private collectionServ: CollectionService) {

    }

    ngOnInit() {

      this.currentTab = 'default';


      this.id = this.route.snapshot.paramMap.get('id');
      console.log('this.id====', this.id);
      if(this.id) {
        this.collectionServ.getCollection(this.id).subscribe(
          (res: any) => {
            console.log('ressssss=', res);
            if(res && res.ok) {
              const collection = res._body;
              console.log('collection=', collection);
              this.name = collection.name.en;
              this.nameChinese = collection.name.zh;
              this.sequence = collection.sequence;
            }
            
          }
        );
      }      
    }

    changeTab(tabName: string) {
      this.currentTab = tabName;
    }

    addCollection() {
      const data = {
         name: {
          en: this.name,
          zh: this.nameChinese
        },
        sequence: this.sequence
      };      
      if(!this.id) {

        this.collectionServ.create(data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.router.navigate(['/admin/collections']);
            }
          }
        );
      } else {
        this.collectionServ.update(this.id, data).subscribe(
          (res: any) => {
            if(res && res.ok) {
              this.router.navigate(['/admin/collections']);
            }
          }
        );
      }

    }
}
