import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { IonList, ToastController } from '@ionic/angular';
import { Apollo, QueryRef } from 'apollo-angular';

import { userFeedQuery, getFavouritePosts, FeedQueryResponse } from './../graphql/queries';
import { addToFavourites, AddToFavouritesMutationResponse } from './../graphql/mutations';
import { Router } from '@angular/router';
import { Post } from '../types';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  feed: Post[];

  loading = false;
  querySubscription: Subscription;
  feedQuery: QueryRef<FeedQueryResponse>;
  limit = 8;
  offset = 0;
  @ViewChild('ionList') ionList: IonList;

  constructor(
    private apollo: Apollo,
    private toastController: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadFeed();
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  loadFeed() {
    this.loading = true;
    this.feedQuery = this.apollo.watchQuery<FeedQueryResponse>({
      query: userFeedQuery,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
    });

    this.feedQuery
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.feed = data.feed;
        this.loading = loading;
      });
  }

  goToDetails(postId) {
    this.router.navigate(['/tabs/home', postId]);
  }

  async fetchMoreFeed(event) {
    try {
      await this.feedQuery.fetchMore({
        variables: {
          offset: this.feed.length,
          limit: this.limit
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          event.target.complete();
          if (!fetchMoreResult) {
            event.target.disabled = true;
            return prev;
          }

          const mergedFeed = {...prev};
          mergedFeed.feed = [
            ...prev.feed, ...fetchMoreResult.feed
          ];

          return mergedFeed;
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addToFavourites(post) {
    await this.ionList.closeSlidingItems();
    this.apollo.mutate<AddToFavouritesMutationResponse>({
      mutation: addToFavourites,
      variables: {
        postId: post.id
      },
      update: (cache , { data }) => {
        const favouritePost = data.addPostToFavourites;
        try {
          const res: any = cache.readQuery({
            query: getFavouritePosts,
            variables: {
              limit: 8,
              offset: 0
            }
          });

          cache.writeQuery({
            query: getFavouritePosts,
            variables: {
              limit: 8,
              offset: 0
            },
            data: {
              me: {
                favourite_posts: [
                  favouritePost,
                  ...res.me.favourite_posts
                ]
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    }).subscribe(async ({ data }) => {
      await this.showToast('Post added to favourites');
    });
  }

  async showToast(message: string) {
    const toastEl = await this.toastController.create({
      message,
      duration: 1500,
    });

    toastEl.present();
  }
}
