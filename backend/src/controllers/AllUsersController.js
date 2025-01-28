const AllUsersService = require("../services/AllUsersService");

class AllUsersController {
  async getAllUsers(req, res) {
    try {
      const allUsers = await AllUsersService.getAllUsers();

      return res.status(201).json(allUsers);
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        error: "Error, cannot get All Users",
      });
    }
  }
}

module.exports = new AllUsersController();
