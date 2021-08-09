import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/modules/shared/services/data.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  storeId: string;
  constructor(private dataServ: DataService) {}
  ngOnInit() {
    this.dataServ.currentStoreId.subscribe(
      (storeId: string) => {
        this.storeId = storeId;
      }
    );
  }

}
