import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink) {

  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZTRmNmE0YTE5ZjMwMjEwMWIwMDg1ZiIsInVzZXJuYW1lIjoib3giLCJpYXQiOjE1OTIxNDc0MjYsImV4cCI6MTU5MjE1MTAyNn0.DL6bpmuFmJzhRumpS2upqsvUNGI2tJyVxfefAd5Gsmg`
    }
  }));

  return {
    link: ApolloLink.from([auth, httpLink.create({uri})]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
