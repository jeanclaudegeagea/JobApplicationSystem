const Company = require("../models/Company");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");

class CompanyRepository {
  async create(companyData) {
    const company = new Company(companyData);
    return await company.save();
  }

  async findById(id) {
    return await Company.findById(id);
  }

  async findByEmail(email) {
    return await Company.findOne({ email });
  }

  async findAll(filter = {}) {
    return await Company.find(filter);
  }

  async updateById(id, updateData) {
    return await Company.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteById(id) {
    return await Company.findByIdAndDelete(id);
  }
  async getApplyingUsers(companyId) {
    // Find all jobs belonging to the company
    const companyJobs = await Job.find({
      company: companyId,
    });

    // Array to store all applying users across all jobs
    const applyingUsers = await Promise.all(
      companyJobs.map(async (job) => {
        const { _id, title } = job;

        // Find all applications for this job
        const applications = await Application.find({
          job: _id,
        });

        // Process each application and fetch user data
        const mappedUsers = await Promise.all(
          applications.map(async (application) => {
            const { user: userId, appliedAt } = application;

            // Find user details using the userId
            const userData = await User.findById(userId);

            // Construct the desired text and return the user data
            return {
              userPP: userData.profilePicture,
              text: `${userData.name} applied to ${title} at ${new Date(
                appliedAt
              ).toLocaleDateString()}`,
            };
          })
        );

        return mappedUsers; // Return array of users for this job
      })
    );

    // Flatten the applyingUsers array of arrays into a single array
    return applyingUsers.flat();
  }
}

module.exports = new CompanyRepository();
