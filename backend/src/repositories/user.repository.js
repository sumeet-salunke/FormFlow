import User from "../models/User.js";

class UserRepository {
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email });
    if (includePassword) {
      query.select("+passwordHash");
    }
    return query;
  }

  //create a user document
  async create(userData) {
    return User.create(userData);
  }
  //find user by mongoId
  async findById(userId) {
    return User.findById(userId);
  }

  async updateName(userId, name) {
    return User.findByIdAndUpdate(
      userId, {
      $set: {
        name
      }
    }, {
      returnDocument: "after",
      runValidators: true,
    },
    );
  }

  async findByIdWithPassword(userId) {
    return User.findById(userId).select("+passwordHash");
  }

  async updatePassword(userId, passwordHash) {
    return User.findByIdAndUpdate(
      userId,
      {
        $set: {
          passwordHash,
        },
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  async deleteById(userId) {
    return User.findByIdAndDelete(userId);
  }
}

export default new UserRepository();