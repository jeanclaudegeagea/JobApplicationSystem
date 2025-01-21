const UserService = require("../services/UserService");

class UserController {
  async register(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserService.createUser(userData);
      res.status(201).json({
        message: "User registered successfully",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const token = await UserService.login(email, password);
      res.status(200).json({
        message: "Login successfull",
        token,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.userId);
      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const updatedUser = await UserService.updateUserById(
        req.userId,
        req.body
      );
      res
        .status(200)
        .json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async deleteProfile(req, res) {
    try {
      await UserService.deleteUserById(req.userId);
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
}

module.exports = new UserController();
