import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../../shared/services/store.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brand-add',
  providers: [],
  templateUrl: './store-add.component.html',
  styleUrls: ['./store-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class StoreAddComponent implements OnInit {
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  id: string;

  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private storeServ: StoreService) {
  }

  ngOnInit() {
    this.currentTab = 'default';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.storeServ.getStore(this.id).subscribe(
        (res: any) => {
          if (res && res.ok) {
            const store = res._body;

            this.name = store.name.en;
            this.nameChinese = store.name.sc;
            this.sequence = store.sequence;
            
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addStore() {
    const data = {
      name: {
        en: this.name,
        sc: this.nameChinese
      },
      sequence: this.sequence ? this.sequence : 0
    };
    if (!this.id) {

      this.storeServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/stores']);
          }
        }
      );
    } else {
      this.storeServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/admin/stores']);
          }
        }
      );
    }

  }
}
