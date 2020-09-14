import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';

import { getCommentsForPost, getPostById } from '../graphql/queries';
import { addComment } from '../graphql/mutations';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  postId: string;
  comments: [] = [];
  loading: boolean;
  commentsQueryRef: QueryRef<any>;
  commentText = '';

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('postId');
      this.getComments(this.postId);
    });
  }

  getComments(postId: string) {
    this.loading = true;
    this.commentsQueryRef = this.apollo.watchQuery<any>({
      query: getCommentsForPost,
      variables: {
        postId
      }
    });

    this.commentsQueryRef.valueChanges.subscribe(({ data, loading }) => {
      this.loading = loading;
      this.comments = data.comments;
    });
  }

  addComment() {
    this.apollo.mutate({
      mutation: addComment,
      variables: {
        postId: this.postId,
        comment: this.commentText
      }, update: (cache, { data }: { data: any }) => {
        const commentsQuery: any = cache.readQuery({
          query: getCommentsForPost,
          variables: {
            postId: this.postId
          }
        });

        cache.writeQuery({
          query: getCommentsForPost,
          variables: {
            postId: this.postId
          },
          data: {
            comments: [data.comment, ...commentsQuery.comments]
          }
        });

        const postQuery: any = cache.readQuery({
          query: getPostById,
          variables: {
            id: this.postId
          }
        });

        cache.writeQuery({
          query: getPostById,
          variables: {
            id: this.postId
          },
          data: {
            post: { ...postQuery.post, commentsCount: postQuery.post.commentsCount + 1 }
          }
        });
      }
    })
      .subscribe(() => {
        this.commentText = '';
      });
  }
}
