import express from "express";

const router = express.Router();

import { register, login , getAllUsers , getUsersJoinedLastMonth , deleteUserById } from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/users", getAllUsers);
router.get("/users/last-month", getUsersJoinedLastMonth);
router.delete("/users/:userId", deleteUserById);
module.exports = router;
