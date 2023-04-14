
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ChefComponent } from './chef.component';
import { FoodListComponent } from './pages/food-list/food-list.component';
import { Order2Component } from './pages/order-2/order-2.component';

const routes: Routes = [
    {
        path: '', 
        component: ChefComponent,
        children: [
            {
                path: '', 
                component: FoodListComponent
            },  
            {
                path: 'food-list', 
                component: FoodListComponent
            }, 
            {
                path: 'order-2/:id', 
                component: Order2Component
            }, 
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})

export class ChefRoutingModule { }
