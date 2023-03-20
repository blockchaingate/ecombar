import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { CoinService } from 'src/app/modules/shared/services/coin.service';
import { DataService } from 'src/app/modules/shared/services/data.service';
import { KanbanService } from 'src/app/modules/shared/services/kanban.service';
import { StoreService } from 'src/app/modules/shared/services/store.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit{

  constructor(
    private dataServ: DataService,
    private kanbanServ: KanbanService,
    private utilServ: UtilService,
    private storeServ: StoreService,
    private coinServ: CoinService,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) =>  {
      const storeId = params.get('storeId');
      if(storeId) {
        this.dataServ.changeStoreId(storeId);
        
        this.storeServ.getStore(storeId).subscribe(
          (ret: any) => {
            if(ret) {
              const store = ret;
              this.dataServ.changeStore(store);
              const currency = store.coin;
              const owner = store.owner;
              this.dataServ.changeStoreOwner(owner);

              this.dataServ.currentWalletAddress.subscribe(
                (walletAddress: string) => {
                  if(walletAddress) {
                    this.kanbanServ.getExchangeBalance(this.utilServ.fabToExgAddress(walletAddress)).subscribe(
                      (resp: any) => {
                          const selected = resp.filter(item => item.coinType == this.coinServ.getCoinTypeIdByName(currency));
                          if(selected && selected.length > 0) {
                            const currencyBalance = this.utilServ.showAmount(selected[0].unlockedAmount, 18);
                            this.dataServ.changeCurrencyBalance(Number(currencyBalance));
                          }
                      },
                      error => {
                      }
                    );
                  }
                }
              );

            }
          }
        );
      }
      
    });

  }
}
