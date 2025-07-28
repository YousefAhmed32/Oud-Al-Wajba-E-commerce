const mongoose = require("mongoose");
const Products = require('../../models/Product');
const Orders = require('../../models/Order');
const User = require('../../models/User');
const moment = require("moment");

const getAdminDashboardSummary = async (req, res) => {
  try {
    const { timeframe = "monthly" } = req.query;

    let dateFormat = "%Y-%m-%d";
    let startDate;
    let rangeCount = 30;
    const now = new Date();

    if (timeframe === "monthly") {
      startDate = moment().subtract(29, "days").startOf("day").toDate();
      dateFormat = "%Y-%m-%d";
      rangeCount = 30;
    } else if (timeframe === "weekly") {
      startDate = moment().subtract(6, "days").startOf("day").toDate();
      dateFormat = "%Y-%m-%d";
      rangeCount = 7;
    } else if (timeframe === "daily") {
      startDate = moment().startOf("day").toDate();
      dateFormat = "%H:00";
      rangeCount = 24;
    } else if (timeframe === "hour") {
      startDate = moment().subtract(59, "minutes").toDate();
      dateFormat = "%H:%M";
      rangeCount = 60;
    } else if (timeframe === "yearly") {
      startDate = moment().subtract(11, "months").startOf("month").toDate();
      dateFormat = "%Y-%m";
      rangeCount = 12;
    } else if (timeframe === "all") {
      startDate = new Date("2025-01-01");
      dateFormat = "%Y-%m";
      rangeCount = moment().diff(startDate, "months") + 1;
    }

    const userDateFilter = { createdAt: { $gte: startDate, $lte: now } };
    const orderDateFilter = { orderDate: { $gte: startDate, $lte: now } };
    const productDateFilter = { createdAt: { $gte: startDate, $lte: now } };

    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(userDateFilter),
      Orders.countDocuments(orderDateFilter),
      Products.countDocuments(productDateFilter),
    ]);

    const timezone = "+03:00"; // adjust if needed

    const [revenueAgg, usersAgg, ordersAgg, productsAgg] = await Promise.all([
      Orders.aggregate([
        { $match: { paymentStatus: "paid", ...orderDateFilter } },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$orderDate",
                timezone
              },
            },
            revenue: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: userDateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$createdAt",
                timezone
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Orders.aggregate([
        { $match: orderDateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$orderDate",
                timezone
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Products.aggregate([
        { $match: productDateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: dateFormat,
                date: "$createdAt",
                timezone
              },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const fullChartData = [];
    for (let i = 0; i < rangeCount; i++) {
      let current;
      if (timeframe === "monthly" || timeframe === "weekly") {
        current = moment(startDate).add(i, "days");
      } else if (timeframe === "daily") {
        current = moment(startDate).add(i, "hours");
      } else if (timeframe === "hour") {
        current = moment(startDate).add(i, "minutes");
      } else if (timeframe === "yearly" || timeframe === "all") {
        current = moment(startDate).add(i, "months");
      }

      const label = current.format(
        timeframe === "hour" ? "HH:mm" :
        timeframe === "daily" ? "HH:00" :
        (timeframe === "yearly" || timeframe === "all") ? "YYYY-MM" :
        "YYYY-MM-DD"
      );

      fullChartData.push({
        label,
        revenue: revenueAgg.find((d) => d._id === label)?.revenue || 0,
        users: usersAgg.find((d) => d._id === label)?.count || 0,
        orders: ordersAgg.find((d) => d._id === label)?.count || 0,
        products: productsAgg.find((d) => d._id === label)?.count || 0,
      });
    }

    const totalRevenue = revenueAgg.reduce((sum, r) => sum + r.revenue, 0);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        chartData: fullChartData,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      message: "Error is here",
    });
  }
};

module.exports = { getAdminDashboardSummary };
