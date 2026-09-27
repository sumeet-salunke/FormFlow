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
}

export default new UserRepository();