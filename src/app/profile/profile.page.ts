import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Apollo, QueryRef } from 'apollo-angular';

import { LoggedInUserQueryResponse, me } from './../graphql/queries';
import { formatNumber } from './../utils/util';
import { Router } from '@angular/router';
import { User } from '../types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: User;
  loading = true;
  querySubscription: Subscription;
  profileQuery: QueryRef<LoggedInUserQueryResponse>;
  offset = 0;
  limit = 12;

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.loading = true;
    this.profileQuery = this.apollo.watchQuery<LoggedInUserQueryResponse>({
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

  goToPostDetails(postId: string) {
    this.router.navigateByUrl(`/tabs/me/${postId}`)
  }

}
