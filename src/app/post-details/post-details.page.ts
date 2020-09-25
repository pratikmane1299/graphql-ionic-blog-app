import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, QueryRef } from 'apollo-angular';

import { GET_POST_By_ID, PostDetailsResponse } from './../graphql/queries';
import { LIKE_UNLIKE_MUTATION, LikeUnLikeMutationResponse } from './../graphql/mutations';
import { Post } from '../types';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  post: Post;
  loading = false;
  postQuery: QueryRef<PostDetailsResponse>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (!params.has('postId')) {
        this.router.navigateByUrl('/home');
      }

      const postId = params.get('postId');
      this.getPostDetails(postId);
    });
  }

  getPostDetails(postId: string) {
    this.loading = true;
    this.postQuery = this.apollo.watchQuery<PostDetailsResponse>({
      query: GET_POST_By_ID,
      variables: {
        id: postId
      }
    });

    this.postQuery
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = false;
        this.post = data.post;
      });
  }

  likeUnLikePost(postId: string) {
    this.apollo.mutate<LikeUnLikeMutationResponse>({
      mutation: LIKE_UNLIKE_MUTATION,
      variables: {
        postId
      },
      update: (cache, { data }) => {
        const res = cache.readQuery<PostDetailsResponse>({
          query: GET_POST_By_ID,
          variables: {
            id: postId
          }
        });

        cache.writeQuery({
          query: GET_POST_By_ID,
          variables: {
            id: postId
          },
          data: {
            post: { 
              ...res.post,
              likesCount: data.likeUnLikePost.post.likesCount,
              liked: !res.post.liked
            }
          }
        });
      }
    }).subscribe(() => console.log('liked/Unliked'));
  }

  viewComments() {
    this.router.navigate(['./comments'], { relativeTo: this.activatedRoute });
  }
}
