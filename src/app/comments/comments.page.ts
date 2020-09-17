import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';

import { ActionSheetController, ToastController } from '@ionic/angular';

import { getCommentsForPost, getPostById } from '../graphql/queries';
import { addComment, deleteComment } from '../graphql/mutations';
import { AuthService } from '../services/auth.service';

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
  user: any;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = params.get('postId');
      this.user = this.authService.userSubject.value;
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

  async showOptions(commentId: string) {
    await this.showOptionsActionSheet(commentId);
  }

  async showOptionsActionSheet(commentId: string) {
    const actionSheetEl = await this.actionSheetController.create({
      header: 'Action',
      buttons: [{
        text: 'Delete',
        icon: 'trash',
        handler: () => {
          this.deleteComment(commentId);
        }
      }, {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close'
      }]
    })

    await actionSheetEl.present();
  }

  deleteComment(commentId: string) {
    this.apollo.mutate({
      mutation: deleteComment,
      variables: {
        commentId
      },
      update: (cache, { data: { deleteComment } }: { data: any }) => {
        
        const commentsQuery: any = cache.readQuery({
          query: getCommentsForPost,
          variables: {
            postId: this.postId
          },
        })

        const comments: any[] = commentsQuery.comments;

        cache.writeQuery({
          query: getCommentsForPost,
          variables: {
            postId: this.postId
          },
          data: {
            comments: comments.filter(comment => comment.id !== deleteComment.id)
          }
        });
      }
    }).subscribe(async () => {
      await this.showToast('Comment deleted');
    })
  }

  async showToast(message: string) {
    const toastEl = await this.toastController.create({
      message,
      duration: 1500,
    });

    toastEl.present();
  }
}
