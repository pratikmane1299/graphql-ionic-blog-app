import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';

import { Storage } from '@ionic/storage';

const uri = 'http://localhost:3000/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink, storage: Storage) {

  let token;
  storage.get('loggedInUser').then(user => {
    token = user.token;
  });

  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }));

  return {
    link: ApolloLink.from([auth, httpLink.create({ uri })]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, Storage],
    },
  ],
})
export class GraphQLModule {}
