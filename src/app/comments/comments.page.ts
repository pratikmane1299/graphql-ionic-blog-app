import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Apollo, QueryRef } from 'apollo-angular';

import { getCommentsForPost } from '../graphql/queries';
import { timeDifferenceForDate } from 'src/app/utils/util';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.page.html',
  styleUrls: ['./comments.page.scss'],
})
export class CommentsPage implements OnInit {

  comments: [] = [];
  loading: boolean;
  commentsQueryRef: QueryRef<any>;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.getComments(params.get('postId'));
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

  formatDate(date: string) {
    return timeDifferenceForDate(date);
  }

}
