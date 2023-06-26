import express from "express";

const router = express.Router();

import {
  prices,
  createSubscription,
  subscriptionStatus,
  subscriptions,
  customerPortal,
  totalEarnings,
  transactions,
} from "../controllers/subs";
import { requireSignin } from "../middlewares";

router.get("/prices", prices);
router.get("/transactions", transactions);
router.get("/total-earnings", totalEarnings);
router.post("/create-subscription", requireSignin, createSubscription);
router.get("/subscription-status", requireSignin, subscriptionStatus);
router.get("/subscriptions", requireSignin, subscriptions);
router.get("/customer-portal", requireSignin, customerPortal);

module.exports = router;
