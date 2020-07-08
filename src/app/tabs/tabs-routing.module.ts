import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        children: [
          {
            path: '',
            loadChildren: () => import('./../home/home.module').then( m => m.HomePageModule)
          },
          {
            path: ':postId',
            loadChildren: () => import('./../post-details/post-details.module').then( m => m.PostDetailsPageModule)
          },
        ]
      },
      {
        path: 'add-post',
        loadChildren: () => import('./../add-post/add-post.module').then( m => m.AddPostPageModule),
      },
      {
        path: '',
        redirectTo: '/tabs/feed',
        pathMatch: 'full'
      },
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/feed',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
