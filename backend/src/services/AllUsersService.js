const AllUsersRepository = require("../repositories/AllUsersRepository");

class AllUsersService {
  async getAllUsers() {
    return await AllUsersRepository.getAllUsers();
  }
}

module.exports = new AllUsersService();
