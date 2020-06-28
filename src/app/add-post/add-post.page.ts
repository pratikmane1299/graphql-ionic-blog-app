import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';

import { userFeedQuery } from './../graphql/queries';
import { addNewPostMutation } from './../graphql/mutations';

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
    this.apollo.mutate({
      mutation: addNewPostMutation,
      variables: {
        title: post.title,
        content: post.content,
        thumbnail: post.thumbnail
      }, update: (cache, { data }) => {
        const existingFeed = cache.readQuery({
          query: userFeedQuery,
          variables: {
            limit: 8,
            offset: 0
          }
        });
        const newPost = data['createPost'];
        cache.writeQuery({
          query: userFeedQuery,
          variables: {
            limit: 8,
            offset: 0
          },
          data: {
            feed: [ newPost, ...existingFeed['feed'] ]
          }
        });
      }
    })
      .subscribe(data => {
        this.isLoading = false;
        this.router.navigateByUrl('/home');
      });
  }

}
