const express = require("express");
const ApplicationService = require("../services/ApplicationService");

class ApplicationController {
  async createApplication(req, res) {
    try {
      const applicationData = req.body;
      applicationData.user = req.userId;
      const application = await ApplicationService.createApplication(
        applicationData
      );
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getApplicationById(req, res) {
    try {
      const { id } = req.params;
      const application = await ApplicationService.getApplicationById(id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllApplications(req, res) {
    try {
      const filter = req.query;
      const applications = await ApplicationService.getAllApplications(filter);
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateApplicationById(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const application = await ApplicationService.updateApplicationById(
        id,
        updateData
      );
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(200).json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteApplicationById(req, res) {
    try {
      const { id } = req.params;
      const application = await ApplicationService.deleteApplicationById(id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(200).json({ message: "Application deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ApplicationController();
