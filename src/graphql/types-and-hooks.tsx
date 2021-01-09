import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  avatar?: Maybe<Scalars['String']>;
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID'];
  price: Scalars['String'];
  name: Scalars['String'];
};

export type Todo = {
  __typename?: 'Todo';
  id: Scalars['ID'];
  title: Scalars['String'];
  completed: Scalars['Boolean'];
};

export type Topic = {
  __typename?: 'Topic';
  label: Scalars['String'];
  likelihood?: Maybe<Scalars['Float']>;
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['ID'];
  title: Scalars['String'];
  body: Scalars['String'];
  published: Scalars['Boolean'];
  createdAt: Scalars['String'];
  author: User;
  likelyTopics?: Maybe<Array<Maybe<Topic>>>;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  allUsers?: Maybe<Array<Maybe<User>>>;
  User?: Maybe<User>;
  allProducts?: Maybe<Array<Maybe<Product>>>;
  Product?: Maybe<Product>;
  Todo?: Maybe<Todo>;
  allTodos?: Maybe<Array<Maybe<Todo>>>;
  Post?: Maybe<Post>;
  allPosts?: Maybe<Array<Maybe<Post>>>;
};


export type QueryAllUsersArgs = {
  count?: Maybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryAllProductsArgs = {
  count?: Maybe<Scalars['Int']>;
};


export type QueryProductArgs = {
  id: Scalars['ID'];
};


export type QueryTodoArgs = {
  id: Scalars['ID'];
};


export type QueryAllTodosArgs = {
  count?: Maybe<Scalars['Int']>;
};


export type QueryPostArgs = {
  id: Scalars['ID'];
};


export type QueryAllPostsArgs = {
  count?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  register?: Maybe<AuthPayload>;
  login?: Maybe<AuthPayload>;
  updateUser?: Maybe<User>;
  createTodo?: Maybe<Todo>;
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  expiresIn?: Maybe<Scalars['String']>;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
  expiresIn?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserArgs = {
  id: Scalars['ID'];
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
};


export type MutationCreateTodoArgs = {
  title: Scalars['String'];
  completed?: Maybe<Scalars['Boolean']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  todoAdded?: Maybe<Todo>;
};

export type AllPostsQueryVariables = Exact<{
  count: Scalars['Int'];
}>;


export type AllPostsQuery = (
  { __typename?: 'Query' }
  & { allPosts?: Maybe<Array<Maybe<(
    { __typename?: 'Post' }
    & Pick<Post, 'title' | 'body' | 'published' | 'createdAt'>
    & { likelyTopics?: Maybe<Array<Maybe<(
      { __typename?: 'Topic' }
      & Pick<Topic, 'label' | 'likelihood'>
    )>>>, author: (
      { __typename?: 'User' }
      & Pick<User, 'id'>
    ) }
  )>>> }
);

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { User?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'firstName' | 'lastName' | 'email' | 'avatar'>
  )> }
);


export const AllPostsDocument = gql`
    query AllPosts($count: Int!) {
  allPosts(count: $count) {
    title
    body
    published
    createdAt
    likelyTopics {
      label
      likelihood
    }
    author {
      id
    }
  }
}
    `;

/**
 * __useAllPostsQuery__
 *
 * To run a query within a React component, call `useAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllPostsQuery({
 *   variables: {
 *      count: // value for 'count'
 *   },
 * });
 */
export function useAllPostsQuery(baseOptions: Apollo.QueryHookOptions<AllPostsQuery, AllPostsQueryVariables>) {
        return Apollo.useQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, baseOptions);
      }
export function useAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AllPostsQuery, AllPostsQueryVariables>) {
          return Apollo.useLazyQuery<AllPostsQuery, AllPostsQueryVariables>(AllPostsDocument, baseOptions);
        }
export type AllPostsQueryHookResult = ReturnType<typeof useAllPostsQuery>;
export type AllPostsLazyQueryHookResult = ReturnType<typeof useAllPostsLazyQuery>;
export type AllPostsQueryResult = Apollo.QueryResult<AllPostsQuery, AllPostsQueryVariables>;
export const UserDocument = gql`
    query User($id: ID!) {
  User(id: $id) {
    firstName
    lastName
    email
    avatar
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, baseOptions);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {}
};
      export default result;
    