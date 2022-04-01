const path = require("path"); // has path and __dirname
const express = require("express");

const userDao = require("../daos/user");
const clientDao = require("../daos/client");
const { successResponse, errorResponse } = require("../utilities/response");
const asyncMiddleware = require("../middlewares/async");

const { createClientValidate } = require("../validations/admin");
const adminController = require("../controllers/admin");

const router = express.Router(); // Instantiate a new router

router.get("/users/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const user = await userDao.findUser({ id: userId });
  if (!user) return errorResponse({ req, res, statusCode: 500 });

  return successResponse(req, res, user);
});

/**
 * @route POST /clients  CRUD client
 */
/**
 * @route PUT /clients  CRUD client
 */
// authenticate user role admin sso adminAuthorize
router.post(
  "/clients",
  createClientValidate,
  asyncMiddleware(adminController.createClient)
);

// entity user

/**
 * @route GET /users  CRUD user
 */

/**
 * @route PUT /users  CRUD user
 */

// api admin sso?
// entity role
/**
 * @route POST /roles  CRUD role
 */

/**
 * @route PUT /roles  CRUD role
 */

// entity user role
/**
 * @route POST /user-roles  CRUD role
 */

/**
 * @route PUT /user-roles  CRUD role
 */

module.exports = router;
