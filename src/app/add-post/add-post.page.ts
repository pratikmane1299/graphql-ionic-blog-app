import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { FeedQueryResponse, USER_FEED_QUERY } from './../graphql/queries';
import { ADD_NEW_POST_MUTATION, AddPostMutationResponse } from './../graphql/mutations';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  isLoading = false;
  constructor(private apollo: Apollo, private router: Router) {
  }

  ngOnInit() {
  }

  onAddPost(post) {
    this.isLoading = true;
    this.apollo.mutate<AddPostMutationResponse>({
      mutation: ADD_NEW_POST_MUTATION,
      variables: {
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail
      }, update: (cache, { data }) => {
        const existingFeed = cache.readQuery<FeedQueryResponse>({
          query: USER_FEED_QUERY,
          variables: {
            limit: 8,
            offset: 0
          }
        });
        const newPost = data.createPost;
        cache.writeQuery({
          query: USER_FEED_QUERY,
          variables: {
            limit: 8,
            offset: 0
          },
          data: {
            feed: [ newPost, ...existingFeed.feed ]
          }
        });
      }
    })
      .subscribe(data => {
        this.isLoading = false;
        this.router.navigateByUrl('/tabs/home');
      });
  }

}
