const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Books {
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }
  type User {
    _id: ID
    username: String
    email: String
    password: String
    bookCount: Int
    savedBooks: [Books]
  }
  type Auth {
    token: String
    user: User
  }
  type Query {
    me(username: String!): User
    myselfnI: [User]
  }
  type Mutation {
    login(email: String!, password: String!): User
    addUser(username: String!, email: String!, password: String!): User
  }
`;

module.exports = typeDefs;
