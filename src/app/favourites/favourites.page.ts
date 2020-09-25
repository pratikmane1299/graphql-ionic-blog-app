import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { Apollo, QueryRef } from 'apollo-angular';

import { FavouritesQueryResponse, GET_FAVOURITE_POSTS } from './../graphql/queries';
import { RemoveFromFavouritesMutationResponse, REMOVE_POST_FROM_FAVOURITES } from './../graphql/mutations';
import { async } from '@angular/core/testing';
import { Post } from '../types';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.page.html',
  styleUrls: ['./favourites.page.scss'],
})
export class FavouritesPage implements OnInit, OnDestroy {

  loading: boolean;
  favouritePosts: Post[] = [];
  favouritesRef: QueryRef<FavouritesQueryResponse>;
  querySubscription: Subscription;
  limit = 8;
  offset = 0;

  constructor(
    private apollo: Apollo,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getFavouritePosts();
  }

  getFavouritePosts() {
    this.loading = true;
    this.favouritesRef = this.apollo.watchQuery<FavouritesQueryResponse>({
      query: GET_FAVOURITE_POSTS,
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

  removePostFromFavourites(post) {
    this.apollo.mutate<RemoveFromFavouritesMutationResponse>({
      mutation: REMOVE_POST_FROM_FAVOURITES,
      variables: {
        postId: post.id
      },
      update: (cache, { data }) => {
        const deletedPostId = data.removePostFromFavourites;
        const res: any = cache.readQuery({
          query: GET_FAVOURITE_POSTS,
          variables: {
            limit: 8,
            offset: 0
          }
        });

        const favouritesList: any[] = res.me.favourite_posts;

        cache.writeQuery({
          query: GET_FAVOURITE_POSTS,
          variables: {
            limit: 8,
            offset: 0
          },
          data: {
            me: {
              favourite_posts: favouritesList.filter(p => p.id !== deletedPostId)
            }
          }
        });
      }
    }).subscribe(async () => {
      await this.showToast('Post removed from favourites');
    });
  }

  async showToast(message: string) {
    const toastEl = await this.toastController.create({
      message,
      duration: 1500,
    });

    toastEl.present();
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

}
