const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const auth = require("../utils/auth");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, ctx) => {
      if (ctx.user) {
        return await User.findById(ctx.user._id).select("-_v -password");
      }

      throw new AuthenticationError(`Not Logged In`);
    },
    user: async (parent, { username }) => User.findOne({ username: username }),
    users: async () => User.find(),
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
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

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, ctx) => {
      if (ctx.user) {
        return await User.findByIdAndUpdate(
          ctx.user._id,
          {
            $push: { savedBooks: input },
          },
          { new: true, runValidators: true }
        ).select("-_v -password");
      }

      throw new AuthenticationError(`Not Logged In`);
    },
    removeBook: async (parent, { bookId }, ctx) => {
      if (ctx.user) {
        return User.findByIdAndUpdate(
          ctx.user._id,
          {
            $pull: { savedBooks: { bookId: bookId } },
          },
          { new: true, runValidators: true }
        ).select("-_v -password");
      }

      throw new AuthenticationError(`Not Logged In`);
    },
    clearBooks: async (parent, args, ctx) => {
      if (ctx.user) {
        return await User.findByIdAndUpdate(
          ctx.user._id,
          {
            $set: { savedBooks: [] },
          },
          { new: true, runValidators: true }
        );
      }

      throw new AuthenticationError(`Not Logged In`);
    },
  },
};

module.exports = resolvers;
