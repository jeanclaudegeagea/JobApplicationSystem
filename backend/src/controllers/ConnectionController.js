const ConnectionService = require("../services/ConnectionService");
const UserRepository = require("../repositories/UserRepository");
const CompanyRepository = require("../repositories/CompanyRepository");

class ConnectionController {
  async follow(req, res, next) {
    try {
      const { follower, followerType, following, followingType } = req.body;

      await ConnectionService.createConnection(
        follower,
        followerType,
        following,
        followingType
      );

      let followerData = await UserRepository.findById(follower);

      if (!followerData) {
        followerData = await CompanyRepository.findById(follower);
      }

      req.body.message = `${followerData.name} followed you`;

      next();
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  async unfollow(req, res) {
    try {
      const { follower, following } = req.body;

      await ConnectionService.deleteConnection(follower, following);

      res.status(201).json({
        message: "Success",
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  async getAllFollowers(req, res) {
    try {
      const { userId } = req.body;

      const result = await ConnectionService.getAllFollowers(userId);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
  async getAllFollowings(req, res) {
    try {
      const { userId } = req.body;

      const result = await ConnectionService.getAllFollowings(userId);

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }

  async isFollowing(req, res) {
    try {
      const { follower, following } = req.body;

      const result = await ConnectionService.isFollowing(follower, following);

      res.status(201).json(result === null ? false : true);
    } catch (error) {
      res.status(400).json({
        error: error.message,
      });
    }
  }
}

module.exports = new ConnectionController();
