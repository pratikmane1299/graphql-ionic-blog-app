import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular';

import { me } from './../graphql/queries';
import { formatNumber } from './../utils/util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user;
  loading = true;
  querySubscription: Subscription;
  profileQuery: QueryRef<any>;
  offset = 0;
  limit = 12;

  constructor(private apollo: Apollo) { }

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.profileQuery = this.apollo.watchQuery<any>({
      query: me,
      variables: {
        offset: this.offset,
        limit: this.limit
      },
    });

    this.profileQuery
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.user = data.me;
        this.loading = loading;
      });
  }

  async fetchMorePosts(event) {
    await this.profileQuery.fetchMore({
      variables: {
        limit: this.limit,
        offset: this.user.posts.length
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        event.target.complete();
        if (!fetchMoreResult) {
          event.target.disabled = true;
          return prev;
        }

        const mergedPosts = { ...prev };
        mergedPosts.me.posts = [
          ...prev.me.posts, ...fetchMoreResult.me.posts
        ];

        return mergedPosts;
      }
    });
  }

  getCount(total: number) {
    return formatNumber(total);
  }

}
