const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
  Query: {
    me: async (parent, { username }) => User.findOne({ username: username }),
    myselfnI: async () => User.find(),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      return user;
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError(`Incorrect Credentials`);
      }

      const passVal = await user.isCorrectPassword(password);

      if (!passVal) {
        throw new AuthenticationError(`Incorrect Credentials`);
      }

      return user;
    },
  },
};

module.exports = resolvers;
