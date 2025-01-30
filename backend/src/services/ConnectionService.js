const ConnectionRepository = require("../repositories/ConnectionRepository");

class ConnectionService {
  async createConnection(follower, followerType, following, followingType) {
    await ConnectionRepository.create(
      follower,
      followerType,
      following,
      followingType
    );
  }
  async deleteConnection(follower, following) {
    await ConnectionRepository.delete(follower, following);
  }
  async getAllFollowers(userId) {
    return await ConnectionRepository.getAllFollowers(userId);
  }
  async getAllFollowings(userId) {
    return await ConnectionRepository.getAllFollowings(userId);
  }

  async isFollowing(follower, following) {
    return await ConnectionRepository.isFollowing(follower, following);
  }

  async getJobsFromFollowedCompanies(userId) {
    return await ConnectionRepository.getJobsFromFollowedCompanies(userId);
  }
}

module.exports = new ConnectionService();
