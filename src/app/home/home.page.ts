import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular';

import { userFeedQuery, getFavouritePosts } from './../graphql/queries';
import { addToFavourites } from './../graphql/mutations';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  feed: any[];

  loading = false;
  querySubscription: Subscription;
  feedQuery: QueryRef<any>;
  limit = 8;
  offset = 0;

  constructor(private apollo: Apollo) { }

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
    this.feedQuery = this.apollo.watchQuery<any>({
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

  addToFavourites(post) {
    this.apollo.mutate({
      mutation: addToFavourites,
      variables: {
        postId: post.id
      },
      update: (cache , { data }) => {
        const favouritePost = data['addPostToFavourites'];
        try {
          const res: any = cache.readQuery({
            query: getFavouritePosts,
          });

          cache.writeQuery({
            query: getFavouritePosts,
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
    }).subscribe(({ data }) => {
      console.log(data);
    });
  }
}
