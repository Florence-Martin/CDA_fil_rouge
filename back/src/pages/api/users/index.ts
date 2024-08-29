import { NextApiRequest, NextApiResponse } from "next";
import { initializeDataSource } from "../../../data-source";
import { UserController } from "@/controllers/userController";
import { UserService } from "@/services/userService";
import { authenticateToken } from "@/utils/verifToken";
import { corsMiddleware } from "@/utils/corsMiddleware";

const userService = new UserService();
const userController = new UserController(userService);

 async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await initializeDataSource();
    await corsMiddleware(req, res);

     // Remove the X-Powered-By header to hide Next.js usage
     res.removeHeader('X-Powered-By');

     // Set additional security headers (Helmet-like)
     res.setHeader('X-Content-Type-Options', 'nosniff');
     //  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    const action = req.query.action as string | undefined;

    switch (req.method) {
       /**
       * @swagger
       * /api/users:
       *   post:
       *     summary: Create a new user
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - users
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               username:
       *                 type: string
       *                 description: The username of the new user
       *                 example: "johndoe"
       *               email:
       *                 type: string
       *                 description: The email of the new user
       *                 example: "johndoe@example.com"
       *               password:
       *                 type: string
       *                 description: The password of the new user
       *                 example: "Password123!@#"
       *               role_uuid:
       *                 type: string
       *                 description: The UUID of the role assigned to the user
       *                 example: "role-uuid-1234"
       *               is_active:
       *                 type: boolean
       *                 description: The active status of the new user
       *                 example: true
       *     responses:
       *       201:
       *         description: User created successfully
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 user_uuid:
       *                   type: string
       *                   description: The UUID of the newly created user
       *                 username:
       *                   type: string
       *                 email:
       *                   type: string
       *                 role:
       *                   type: string
       *                 is_active:
       *                   type: boolean
       *       400:
       *         description: Invalid input
       *       409:
       *         description: Conflict with existing resource
       */
      case "POST":
        await userController.createUser(req, res);
        break;
      /**
        * @swagger
        * /api/users:
        *   get:
        *     summary: Retrieve all users or a specific user by UUID or username
        *     security:
        *       - bearerAuth: []
        *     tags:
        *       - users
        *     parameters:
        *       - name: user_uuid
        *         in: query
        *         description: UUID of the user to retrieve (optional)
        *         required: false
        *         schema:
        *           type: string
        *       - name: username
        *         in: query
        *         description: Username of the user to retrieve (optional)
        *         required: false
        *         schema:
        *           type: string
        *     responses:
        *       200:
        *         description: A list of users or a specific user based on query parameters
        *         content:
        *           application/json:
        *             schema:
        *               type: object
        *               properties:
        *                 user_uuid:
        *                   type: string
        *                   description: The UUID of the user
        *                 username:
        *                   type: string
        *                   description: The username of the user
        *                 email:
        *                   type: string
        *                   description: The email of the user
        *                 role:
        *                   type: object
        *                   properties:
        *                     role_uuid:
        *                       type: string
        *                       description: The UUID of the role
        *                     role_name:
        *                       type: string
        *                       description: The name of the role
        *                     created_at:
        *                       type: string
        *                       format: date-time
        *                     updated_at:
        *                       type: string
        *                       format: date-time
        *                   description: The role of the user
        *                 is_active:
        *                   type: boolean
        *                   description: The active status of the user
        *               example:
        *                 user_uuid: "123e4567-e89b-12d3-a456-426614174000"
        *                 username: "johndoe"
        *                 email: "johndoe@example.com"
        *                 role:
        *                   role_uuid: "c7573cdc-1677-4bb5-85d9-178c8f9baa8e"
        *                   role_name: "admin"
        *                   created_at: "2024-08-14T17:38:27.625Z"
        *                   updated_at: "2024-08-14T17:38:27.625Z"
        *                 is_active: true
        */
      case "GET":
        if (req.query.user_uuid) {
          await userController.getUserById(req, res);
        } else if (req.query.username) {
          await userController.getUserByUsername(req, res);
        } else {
          await userController.getAllUsers(req, res);
        }
        break;
      /**
       * @swagger
       * /api/users:
       *   put:
       *     summary: Replace an existing user
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - users
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               user_uuid:
       *                 type: string
       *                 description: The UUID of the user to be replaced
       *                 example: "123e4567-e89b-12d3-a456-426614174000"
       *               username:
       *                 type: string
       *                 description: The new username
       *                 example: "newusername"
       *               email:
       *                 type: string
       *                 description: The new email
       *                 example: "newemail@example.com"
       *               password:
       *                 type: string
       *                 description: The new password
       *                 example: "NewPassword123!@#"
       *               role:
       *                 type: object
       *                 properties:
       *                   role_uuid:
       *                     type: string
       *                     description: The UUID of the new role
       *                     example: "role-uuid-5678"
       *               is_active:
       *                 type: boolean
       *                 description: The active status to set
       *                 example: true
       *     responses:
       *       200:
       *         description: User replaced successfully
       *       400:
       *         description: Invalid input
       *       404:
       *         description: User not found
       */
      case "PUT":
        await userController.replaceUser(req, res);
        return;

      /**
      * @swagger
      * /api/users:
      *   patch:
      *     summary: Update user fields or toggle user active status
      *     security:
      *       - bearerAuth: []
      *     tags:
      *       - users
      *     parameters:
      *       - name: action
      *         in: query
      *         description: The action to perform (e.g., toggleActiveStatus)
      *         required: true
      *         schema:
      *           type: string
      *           example: "toggleActiveStatus"
      *     requestBody:
      *       required: true
      *       content:
      *         application/json:
      *           schema:
      *             type: object
      *             properties:
      *               user_uuid:
      *                 type: string
      *                 description: The UUID of the user to update
      *                 example: "123e4567-e89b-12d3-a456-426614174000"
      *               is_active:
      *                 type: boolean
      *                 description: The active status to set (only for toggleActiveStatus action)
      *                 example: true
      *               username:
      *                 type: string
      *                 description: The new username
      *                 example: "updatedusername"
      *               email:
      *                 type: string
      *                 description: The new email
      *                 example: "updatedemail@example.com"
      *               password:
      *                 type: string
      *                 description: The new password
      *                 example: "UpdatedPassword123!@#"
      *               role_uuid:
      *                 type: string
      *                 description: The UUID of the new role
      *                 example: "role-uuid-5678"
      *     responses:
      *       200:
      *         description: User updated successfully
      *       400:
      *         description: Invalid input
      *       404:
      *         description: User not found
      */
      case "PATCH":
        if (action === 'toggleActiveStatus') {
          if (!req.query.user_uuid || typeof req.body.is_active !== 'boolean') {
            return res.status(400).json({ error: "Invalid input" });
          }
          await userController.toggleUserActiveStatus(req, res);
        } else {
          if (!req.query.user_uuid) {
            return res.status(400).json({ error: "User UUID is required for update" });
          }
          await userController.updateUserPatch(req, res);
        }
        break;
      /**
       * @swagger
       * /api/users:
       *   delete:
       *     summary: Delete a user by UUID
       *     security:
       *       - bearerAuth: []
       *     tags:
       *       - users
       *     parameters:
       *       - name: user_uuid
       *         in: query
       *         description: UUID of the user to delete
       *         required: true
       *         schema:
       *           type: string
       *     responses:
       *       204:
       *         description: User deleted successfully
       *       404:
       *         description: User not found
       */
      case "DELETE":
        if (!req.query.user_uuid) {
          return res.status(400).json({ error: "User UUID is required for deletion" });
        }
        await userController.deleteUser(req, res);
        break;

      default:
        res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Handler error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export default authenticateToken(handler)