import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Apollo, QueryRef } from 'apollo-angular';

import { getFavouritePosts } from './../graphql/queries';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit, OnDestroy {

  loading: boolean;
  favouritePosts: [] = [];
  favouritesRef: QueryRef<any>;
  querySubscription: Subscription;
  limit = 8;
  offset = 0;

  constructor(
    private apollo: Apollo,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getFavouritePosts();
  }

  getFavouritePosts() {
    this.loading = true;
    this.favouritesRef = this.apollo.watchQuery<any>({
      query: getFavouritePosts,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
    });

    this.querySubscription = this.favouritesRef
    .valueChanges.subscribe(({ data, loading }) => {
      this.loading = loading;
      this.favouritePosts = data.me.favourite_posts;
    });
  }

  goToDetails(postId) {
    this.router.navigate(['/tabs/favourites', postId]);
  }

  async fetchMore(event) {
    try {
      await this.favouritesRef.fetchMore({
        variables: {
          offset: this.favouritePosts.length,
          limit: this.limit
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          event.target.complete();
          if (!fetchMoreResult) {
            event.target.disabled = true;
            return prev;
          }

          const mergedFavourites = {...prev};
          mergedFavourites.me.favourite_posts = [
            ...prev.me.favourite_posts, ...fetchMoreResult.me.favourite_posts
          ];

          return mergedFavourites;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
