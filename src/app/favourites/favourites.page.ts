import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { getFavouritePosts } from './../graphql/queries';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit {

  favouritePosts: [] = [];
  constructor(private apollo: Apollo, private authService: AuthService) { }

  ngOnInit() {
    this.getFavouritePosts();
  }

  getFavouritePosts() {
    this.apollo.watchQuery<any>({
      query: getFavouritePosts,
    }).valueChanges.subscribe(({ data }) => {
      this.favouritePosts = data.me.favourite_posts;
    });
  }

}
