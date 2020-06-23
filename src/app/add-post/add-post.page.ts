import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const addNewPostMutation = gql`
  mutation addNewPost($title: String!, $content: String!, $thumbnail: String) {
    createPost(title: $title, content: $content, thumbnail: $thumbnail) {
      id
      title
      content
      thumbnail
      createdAt
    }
  }
`;

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
          query: userFeedQuery
        });
        const newPost = data['createPost'];
        cache.writeQuery({
          query: userFeedQuery,
          data: {
            posts: [ newPost, ...existingFeed['posts'] ]
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
