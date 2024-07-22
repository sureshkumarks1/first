const orderCollection = require("../models/orderModel");
const formatDate = require("../helper/formatDate");
const exceljs = require("exceljs");
const { ObjectId } = require("mongodb");
const moment = require("moment");

//get sales report page
const salesReport = async (req, res, next) => {
  const { startDate, endDate } = req.body;

  try {
    let salesData = await orderCollection
      .find({
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        orderStatus: {
          $eq: "Delivered",
        },
        grandTotalCost: {
          $gt: 0,
        },
      })
      .populate("userId addressChosen");
    // console.log(salesData);

    salesData = salesData.map((v) => {
      // v.orderDateFormatted = formatDate(v.orderDate);
      v.orderDateFormatted = moment(v.orderDate).format("MM-DD-YYYY");

      return v;
    });
    if (!salesData) {
      res.json({ data: "No values" });
    }
    res.json({ data: salesData });

    //res.render("salesReport", { salesData, dateValues: null });
  } catch (error) {
    console.error(error);
  }
};

//sales report download
const salesReportDownload = async (req, res) => {
  try {
    const workBook = new exceljs.Workbook();
    const sheet = workBook.addWorksheet("book");
    sheet.columns = [
      { header: "No", key: "no", width: 10 },
      { header: "Username", key: "username", width: 25 },
      { header: "Order Date", key: "orderDate", width: 25 },
      { header: "Products", key: "products", width: 35 },
      { header: "No of items", key: "noOfItems", width: 35 },
      { header: "Coupon", key: "coupon", width: 25 },
      { header: "Total Discount", key: "totalDiscount", width: 25 },
      { header: "Total Cost", key: "totalCost", width: 25 },
      { header: "Payment Method", key: "paymentMethod", width: 25 },
      { header: "Status", key: "status", width: 20 },
    ];

    if (req.session?.admin?.dateValues) {
      let startDate = new Date(req.session?.admin?.dateValues.startDate);
      startDate.setUTCHours(0, 0, 0, 0);

      let endDate = new Date(req.session?.admin?.dateValues.endDate);
      endDate.setUTCHours(23, 59, 59, 999);

      let salesData = await orderCollection
        .find({
          orderDate: {
            $gte: startDate,
            $lte: endDate,
          },
        })
        .populate("userId");

      salesData = salesData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      salesData.map((v) => {
        sheet.addRow({
          no: v.orderNumber,
          username: v.userId.name,
          orderDate: v.orderDateFormatted,
          products: v.cartData.map((v) => v.productId.productName).join(", "),
          noOfItems: v.cartData.map((v) => v.productQuantity).join(", "),
          coupon: v.couponApplied,
          totalDiscount: v.totalDiscount,
          totalCost: "₹" + v.grandTotalCost,
          paymentMethod: v.paymentType,
          status: v.orderStatus,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=salesReport.xlsx"
      );

      workBook.xlsx.write(res);
    } else {
      let salesData = await orderCollection
        .find()
        .sort({ orderDate: -1 })
        .populate("userId couponApplied");

      salesData = salesData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });

      salesData.map((v) => {
        sheet.addRow({
          no: v.orderNumber,
          username: v.userId.name,
          orderDate: v.orderDateFormatted,
          products: v.cartData.map((v) => v.productId.productName).join(", "),
          noOfItems: v.cartData.map((v) => v.productQuantity).join(", "),
          coupon: v.couponApplied,
          totalDiscount: v.totalDiscount,
          totalCost: "₹" + v.grandTotalCost,
          paymentMethod: v.paymentType,
          status: v.orderStatus,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=salesReport.xlsx"
      );

      workBook.xlsx.write(res);
    }
  } catch (error) {
    console.log(error);
  }
};

//sales report filter
const salesReportFilter = async (req, res) => {
  try {
    let startDate = new Date(req.body.startDate);
    startDate.setUTCHours(0, 0, 0, 0);

    let endDate = new Date(req.body.endDate);
    endDate.setUTCHours(23, 59, 59, 999);

    let salesData = await orderCollection
      .find({
        orderDate: { $gte: startDate, $lte: endDate },
      })
      .populate("userId");

    salesData = salesData.map((v) => {
      v.orderDateFormatted = formatDate(v.orderDate);
      return v;
    });

    console.log(salesData);

    req.session.admin = {};
    req.session.admin.dateValues = req.body;
    req.session.admin.salesData = JSON.parse(JSON.stringify(salesData));
    console.log(req.session.admin.dateValues);
    // console.log(typeof(req.session.admin.salesData));

    res.status(200).json({ success: true, salesData });
  } catch (error) {
    console.error(error);
  }
};

//weekly sales report
const salesReportFilterWeekly = async (req, res) => {
  try {
    // Calculate the start and end date of the current week
    let currentDate = new Date();
    let firstDayOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    let lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);

    let salesData = await orderCollection
      .find({
        orderDate: { $gte: firstDayOfWeek, $lte: lastDayOfWeek },
      })
      .populate("userId couponApplied");

    salesData = salesData.map((v) => {
      v.orderDateFormatted = formatDate(v.orderDate);
      return v;
    });

    req.session.admin = {};
    req.session.admin.dateValues = {
      startDate: firstDayOfWeek,
      endDate: lastDayOfWeek,
    };
    req.session.admin.salesData = JSON.parse(JSON.stringify(salesData));

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  salesReport,
  salesReportDownload,
  salesReportFilter,
  salesReportFilterWeekly,
};
