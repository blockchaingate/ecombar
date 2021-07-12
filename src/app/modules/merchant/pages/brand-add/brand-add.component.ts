import { Component, OnInit } from '@angular/core';
import { BrandService } from '../../../shared/services/brand.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-admin-brand-add',
  providers: [],
  templateUrl: './brand-add.component.html',
  styleUrls: ['./brand-add.component.scss', '../../../../../select.scss', '../../../../../button.scss']
})
export class BrandAddComponent implements OnInit {
  sequence: number;
  name: string;
  nameChinese: string;
  currentTab: string;
  walletAddress: string;
  id: string;

  constructor(
    private dataServ: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private brandServ: BrandService) {
  }

  ngOnInit() {
    this.dataServ.currentWalletAddress.subscribe(
      (walletAddress: string) => {
        this.walletAddress = walletAddress;
      }
    );    
    this.currentTab = 'default';

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.brandServ.getBrand(this.id).subscribe(
        (res: any) => {
          console.log('ressssss=', res);
          if (res && res.ok) {
            const brand = res._body;
            this.name = brand.name[0].text;
            this.nameChinese = brand.name[1].text;
            this.sequence = brand.sequence;
            
          }

        }
      );
    }
  }

  changeTab(tabName: string) {
    this.currentTab = tabName;
  }

  addBrand() {

    const name = [
      {
        lan: 'en',
        text: this.name
      },
      {
        lan: 'sc',
        text: this.nameChinese
      }
    ];      
    const data = {
      owner: this.walletAddress,
      name: name,
      sequence: this.sequence ? this.sequence : 0
    };
    if (!this.id) {

      this.brandServ.create(data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/brands']);
          }
        }
      );
    } else {
      this.brandServ.update(this.id, data).subscribe(
        (res: any) => {
          if (res && res.ok) {
            this.router.navigate(['/merchant/brands']);
          }
        }
      );
    }

  }
}
