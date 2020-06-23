import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { timeDifferenceForDate } from './../utils/util';

const userFeedQuery = gql`
  query posts {
    posts {
      id
      title
      content
      thumbnail
      createdAt
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

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit() {
    // this.loadFeed();
  }

  ionViewWillEnter() {
    this.loadFeed();
  }

  goToAddPost() {
    this.router.navigateByUrl('/add-post');
  }

  ngOnDestroy() {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  loadFeed() {
    this.loading = true;
    this.querySubscription = this.apollo.watchQuery({
      query: userFeedQuery
    })
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.feed = data['posts'];
        this.loading = loading;
      });
  }

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
