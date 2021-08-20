import { NgModule } from '@angular/core';
import {CommunityRoutingModule } from './community-routing.module';
import { CommonModule } from '@angular/common';
import { CommunityComponent } from './community.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CommunityComponent
  ],
  imports: [
    CommunityRoutingModule,
    CommonModule,
    FormsModule,
    SharedModule
  ],
  providers: []
})
export class CommunityModule { }
