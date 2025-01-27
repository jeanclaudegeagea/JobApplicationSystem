const upload = require("../config/multerConfig");
const UserService = require("../services/UserService");

class UserController {
  async register(req, res) {
    try {
      const requiredFields = ["name", "email", "phoneNumber", "password"];

      const userData = req.body;

      const missingFields = requiredFields.filter(
        (field) => !userData[field]?.trim()
      );

      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        });
      }
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

      if (!email?.trim() || !password?.trim()) {
        return res.status(401).json({
          error: "All fields are required",
        });
      }

      const user = await UserService.login(email, password);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const { userId } = req.params;

      const user = await UserService.getUserById(userId);
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
      upload.fields([
        { name: "profilePicture", maxCount: 1 },
        { name: "cv", maxCount: 1 },
      ])(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ error: err.message });
        }

        // Get the updated data from the request body
        const updateData = req.body;

        // If files are uploaded, add file paths (URLs) to the update data
        if (req.files.profilePicture) {
          updateData.profilePicture = `/uploads/${req.files.profilePicture[0].filename}`;
        }
        if (req.files.cv) {
          updateData.cv = `/uploads/${req.files.cv[0].filename}`;
        }

        if (req.body.experience) {
          updateData.experience = JSON.parse(req.body.experience); // Convert JSON string to array of objects
        }
        if (req.body.university) {
          updateData.university = JSON.parse(req.body.university); // Convert JSON string to array of objects
        }

        // Update the user's profile with new data
        const updatedUser = await UserService.updateUserById(
          req.userId,
          updateData
        );
        res.status(200).json({
          message: "Profile updated successfully",
          updatedUser,
        });
      });
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
