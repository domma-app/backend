import Hapi from "@hapi/hapi";
import { ChallengeService } from "../services/challenge.service";

export class ChallengeController {
  private challengeService: ChallengeService;

  constructor() {
    this.challengeService = new ChallengeService();
  }

  /**
   * Create a new challenge
   */
  createChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const challenge = await this.challengeService.createChallenge(
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge created successfully!",
          data: challenge,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get all challenges for the user
   */
  getChallenges = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const { page = 1, limit = 10 } = request.query as any;
      const result = await this.challengeService.getChallenges(
        Number(page),
        Number(limit)
      );

      // Use a simplified response format - remove nested objects where possible
      const response = {
        status: true,
        message: "Challenges fetched successfully!",
        data: result.data.map(challenge => ({
          id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          total_days: challenge.total_days,
          type: challenge.type
        })),
        totalItems: result.meta.totalItems,
        itemCount: result.meta.itemCount,
        itemsPerPage: result.meta.itemsPerPage,
        totalPages: result.meta.totalPages,
        currentPage: result.meta.currentPage
      };

      return h
        .response(response)
        .header("Content-Encoding", "identity")
        .header("Cache-Control", "no-transform")
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get a challenge by ID
   */
  getChallengeById = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const challenge = await this.challengeService.getChallengeById(id);

      if (!challenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: "Challenge fetched successfully!",
          data: challenge,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Update a challenge
   */
  updateChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const existingChallenge = await this.challengeService.getChallengeById(
        id
      );

      if (!existingChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      const updatedChallenge = await this.challengeService.updateChallenge(
        id,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge updated successfully!",
          data: updatedChallenge,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Delete a challenge
   */
  deleteChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const existingChallenge = await this.challengeService.getChallengeById(
        id
      );

      if (!existingChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found",
          })
          .code(404);
      }

      await this.challengeService.deleteChallenge(id);

      return h
        .response({
          status: true,
          message: "Challenge deleted successfully!",
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Join a new challenge
   */
  joinChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const challenge = await this.challengeService.joinChallenge(
        userId,
        request.payload as any
      );

      return h
        .response({
          status: true,
          message: "Challenge joined successfully!",
          data: challenge,
        })
        .code(201);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get active challenges for the current user
   */
  getActiveChallenges = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const { page = 1, limit = 10 } = request.query as any;

      const result = await this.challengeService.getActiveChallenges(
        userId,
        Number(page),
        Number(limit)
      );

      return h
        .response({
          status: true,
          message: "Active challenges fetched successfully!",
          data: result.data,
          meta: result.meta,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge summary
   */
  getChallengeSummary = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const summary = await this.challengeService.getChallengeSummary(userId);

      return h
        .response({
          status: true,
          message: "Challenge summary fetched successfully!",
          data: summary,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenges by status
   */
  getChallengesByStatus = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const status = request.query.status as string;

      if (!["active", "completed", "failed"].includes(status)) {
        return h
          .response({
            status: false,
            message:
              "Invalid status. Must be 'active', 'completed', or 'failed'",
          })
          .code(400);
      }

      const challenges = await this.challengeService.getChallengesByStatus(
        userId,
        status
      );

      return h
        .response({
          status: true,
          message: `${
            status.charAt(0).toUpperCase() + status.slice(1)
          } challenges fetched successfully!`,
          data: { challenges },
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get available challenges from catalog
   */
  getCatalogChallenges = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const {
        page = 1,
        limit = 10,
        type,
        difficulty,
        category,
      } = request.query as any;

      const filters: any = {};
      if (type) filters.type = type;
      if (difficulty) filters.difficulty = Number(difficulty);
      if (category) filters.category = category;

      const result = await this.challengeService.getCatalogChallenges(
        Number(page),
        Number(limit),
        filters
      );

      return h
        .response({
          status: true,
          message: "Challenge catalog fetched successfully!",
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Record progress through check-in
   */
  checkIn = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string; // userChallengeId
      const userId = request.auth.credentials.id as string;

      // Log the check-in attempt
      console.log(
        `Check-in attempt: userChallengeId=${id}, userId=${userId}, date=${
          (request.payload as any).date
        }`
      );

      const updatedChallenge = await this.challengeService.checkIn(
        id,
        userId,
        request.payload as any
      );

      if (!updatedChallenge) {
        return h
          .response({
            status: false,
            message: "Challenge not found or not authorized",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: "Check-in recorded successfully!",
          data: updatedChallenge,
        })
        .code(200);
    } catch (error: any) {
      // Log the error
      console.error(`Check-in error: ${error.message}`);

      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge history (completed challenges)
   */
  getChallengeHistory = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const {
        page = 1,
        limit = 10,
        sortBy = "completedDate",
        sortOrder = "desc",
      } = request.query as any;

      const result = await this.challengeService.getChallengeHistory(
        userId,
        Number(page),
        Number(limit),
        sortBy,
        sortOrder
      );

      return h
        .response({
          status: true,
          message: "Challenge history fetched successfully!",
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge activity log
   */
  getChallengeActivity = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const { page = 1, limit = 10, startDate, endDate } = request.query as any;

      // Convert date strings to Date objects if provided
      const startDateObj = startDate ? new Date(startDate) : undefined;
      const endDateObj = endDate ? new Date(endDate) : undefined;

      const result = await this.challengeService.getChallengeActivity(
        id,
        userId,
        Number(page),
        Number(limit),
        startDateObj,
        endDateObj
      );

      if (!result) {
        return h
          .response({
            status: false,
            message: "Challenge not found or not authorized",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: "Challenge activity fetched successfully!",
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge statistics
   */
  getChallengeStatistics = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const userId = request.auth.credentials.id as string;
      const { period = "all-time" } = request.query as any;

      const stats = await this.challengeService.getChallengeStatistics(
        userId,
        period
      );

      return h
        .response({
          status: true,
          message: "Challenge statistics fetched successfully!",
          data: stats,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get available and earned badges
   */
  getBadges = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const userId = request.auth.credentials.id as string;
      const badges = await this.challengeService.getBadges(userId);

      return h
        .response({
          status: true,
          message: "Badges fetched successfully!",
          data: badges,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge options
   */
  getChallengeOptions = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const options = await this.challengeService.getChallengeOptions();

      return h
        .response({
          status: true,
          message: "Challenge options fetched successfully!",
          data: options,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge categories
   */
  getChallengeCategories = async (
    request: Hapi.Request,
    h: Hapi.ResponseToolkit
  ) => {
    try {
      const categories = await this.challengeService.getChallengeCategories();

      return h
        .response({
          status: true,
          message: "Challenge categories fetched successfully!",
          data: categories,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Get challenge leaderboard
   */
  getLeaderboard = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const {
        challengeId,
        period = "all-time",
        limit = 10,
      } = request.query as any;

      const leaderboard = await this.challengeService.getLeaderboard(
        challengeId,
        period,
        Number(limit)
      );

      return h
        .response({
          status: true,
          message: "Leaderboard fetched successfully!",
          data: leaderboard,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };

  /**
   * Share challenge progress
   */
  shareChallenge = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    try {
      const id = request.params.id as string;
      const userId = request.auth.credentials.id as string;
      const { platform, message } = request.payload as any;

      const result = await this.challengeService.shareChallenge(
        id,
        userId,
        platform,
        message
      );

      if (!result) {
        return h
          .response({
            status: false,
            message: "Challenge not found or not authorized",
          })
          .code(404);
      }

      return h
        .response({
          status: true,
          message: `Challenge shared on ${platform} successfully!`,
          data: result,
        })
        .code(200);
    } catch (error: any) {
      return h
        .response({
          status: false,
          message: error.message,
        })
        .code(400);
    }
  };
}
