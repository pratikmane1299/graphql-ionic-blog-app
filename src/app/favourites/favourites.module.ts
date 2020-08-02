import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavouritesPageRoutingModule } from './favourites-routing.module';

import { FavouritesPage } from './favourites.page';
import { PostItemComponent } from '../components/post-item/post-item.component';
import { PostSkeletonComponent } from '../components/post-skeleton/post-skeleton.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavouritesPageRoutingModule
  ],
  declarations: [FavouritesPage, PostItemComponent, PostSkeletonComponent]
})
export class FavouritesPageModule {}
