const Company = require("../models/Company");
const User = require("../models/User");

class AllUsersRepository {
  async getAllUsers() {
    const allCompanies = await Company.find().lean();
    const allUsers = await User.find().lean();

    return [
      ...allCompanies.map((company) => {
        return {
          ...company,
          type: "Company",
        };
      }),
      ...allUsers.map((user) => {
        return {
          ...user,
          type: "User",
        };
      }),
    ];
  }
}

module.exports = new AllUsersRepository();
