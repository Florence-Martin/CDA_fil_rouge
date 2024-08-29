// src/__tests__/followController.test.js
const { FollowController } = require("@/controllers/FollowController");
const { FollowService } = require("@/services/followServices");
const { EntityNotFoundError } = require("@/errors/errors");

// Mock FollowService
jest.mock("@/services/followServices");

describe("FollowController", () => {
  let req; 
  let res;
  let followController;

  beforeEach(() => {
    req = {
      body: {
        user_uuid: "123e4567-e89b-12d3-a456-426614174000",
        follower_uuid: "123e4567-e89b-12d3-a456-426614174000",
      },
      query: {
        user_uuid: "123e4567-e89b-12d3-a456-426614174000",
        follower_uuid: "123e4567-e89b-12d3-a456-426614174000",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };

    followController = new FollowController(new FollowService());
  });

  it("devrait suivre un utilisateur avec succès", async () => {
    const follow = { user_uuid: "123e4567-e89b-12d3-a456-426614174000", follower_uuid: "123e4567-e89b-12d3-a456-426614174000" };
    FollowService.prototype.followUser.mockResolvedValue(follow);

    await followController.followUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(follow);
  });

  it("devrait retourner une erreur 400 pour des UUID manquants", async () => {
    req.body = { user_uuid: "123e4567-e89b-12d3-a456-426614174000" }; // Missing follower_uuid

    await followController.followUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "User UUID and Follower UUID are required." });
  });

  it("devrait ne pas pouvoir suivre un utilisateur et retourner une erreur 500", async () => {
    FollowService.prototype.followUser.mockRejectedValue(new Error("Some error"));

    await followController.followUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });

  it("devrait ne pas pouvoir suivre un utilisateur et retourner une erreur 404", async () => {
    FollowService.prototype.followUser.mockRejectedValue(new EntityNotFoundError("Entity not found with id undefined not found"));

    await followController.followUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Entity not found with id undefined not found with id undefined not found" });
  });

  it("devrait ne pas pouvoir se désabonner et retourner une erreur 404", async () => {
    FollowService.prototype.unfollowUser.mockResolvedValue(false);

    await followController.unfollowUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Follow relationship not found." });
  });

  it("devrait se désabonner avec succès", async () => {
    FollowService.prototype.unfollowUser.mockResolvedValue(true);

    await followController.unfollowUser(req, res);

    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it("devrait récupérer les abonnés d'un utilisateur avec succès", async () => {
    const followers = [{ id: "1", name: "Follower" }];
    FollowService.prototype.getFollowers.mockResolvedValue(followers);

    await followController.getFollowers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(followers);
  });

  it("devrait retourner une erreur 400 pour un UUID utilisateur invalide", async () => {
    req.query.user_uuid = undefined; // Invalid user_uuid

    await followController.getFollowers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Valid user UUID is required." });
  });

  it("devrait récupérer les utilisateurs suivis avec succès", async () => {
    const following = [{ id: "1", name: "Following" }];
    FollowService.prototype.getFollowing.mockResolvedValue(following);

    await followController.getFollowing(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(following);
  });

  it("devrait retourner une erreur 400 pour un UUID de suiveur invalide", async () => {
    req.query.follower_uuid = undefined; // Invalid follower_uuid

    await followController.getFollowing(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Valid follower UUID is required." });
  });
});
