import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const userFeedQuery = gql`
  query posts {
    posts {
      id
      title
      content
      thumbnail
      createdAt
      author {
        username
      }
    }
  }
`;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  feed: [] = [];

  loading = false;
  querySubscription: Subscription;

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
    this.querySubscription = this.apollo.watchQuery<any>({
      query: userFeedQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.feed = data.posts;
        this.loading = loading;
      });
  }

}
