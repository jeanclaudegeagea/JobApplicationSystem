const UserRepository = require("../repositories/UserRepository");
const bcrypt = require("bcrypt");
const UserAuthService = require("./UserAuthService");

class UserService {
  async createUser(userData) {
    const isUserExists = await UserRepository.findByEmail(userData.email);

    if (isUserExists) {
      throw new Error("User with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);

    return await UserRepository.create(userData);
  }

  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Generate JWT token
    const token = UserAuthService.generateToken(user._id);
    return {
      user,
      token,
      type: "User",
    };
  }

  async isProfileComplete(userId) {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error("User not found");
    return user.isProfileComplete();
  }

  async getUserById(id) {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async getAllUsers(filter = {}) {
    return await UserRepository.findAll(filter);
  }

  async updateUserById(id, updateData) {
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    const updatedUser = await UserRepository.updateById(id, updateData);
    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  async deleteUserById(id) {
    const deletedUser = await UserRepository.deleteById(id);
    if (!deletedUser) {
      throw new Error("User not found");
    }
    return deletedUser;
  }
}

module.exports = new UserService();
