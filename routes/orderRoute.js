const express = require("express");
const { createOrder, getOrders, getUsers, payment, orderSummary, order, deliverOrder, customerOrders } = require("../controllers/orderController");
const router = express.Router();

router.post("/", createOrder); // post order
router.get("/order", getOrders); // get orders
router.get("/user", getUsers); // get users
router.get("/summary", orderSummary); // data for dashboard
router.post("/checkout", payment); // add payment
router.get("/userOrder/:customerId", customerOrders); // customer orders
router.get("/:id", order); // single order
router.put("/:id", deliverOrder); // deliver order

module.exports = router;
