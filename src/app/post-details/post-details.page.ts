import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

import { getPostById } from './../graphql/queries';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.page.html',
  styleUrls: ['./post-details.page.scss'],
})
export class PostDetailsPage implements OnInit {
  post: any;
  loading = false;
  showToolbar = false;

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
    this.apollo.query<any>({
      query: getPostById,
      variables: {
        id: postId
      }
    }).subscribe(({data, loading}) => {
      this.loading = false;
      this.post = data.post;
    });
  }

}
