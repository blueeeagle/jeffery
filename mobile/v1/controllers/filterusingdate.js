const breakfast = require("../../../models/addbreakfast");
const lunchData = require("../../../models/addlunch");
const pmSnaksData = require("../../../models/addpmsnake");
const supperData = require("../../../models/supper");
const vegetarianData = require("../../../models/vegetarian");
const amSnackData = require("../../../models/amSnack");
const boxLunches = require('../../../models/boxLunches')

const moment = require("moment");
const momentTz = require("moment-timezone");

//menu show on website
exports.findusingdate = async (req, res, next) => {
  try {
    const date = req.body.date;
    const weekMenu = req.body.weekMenu;
    const userId = req.user._id;

    console.log("req........", req.body);

    let startDate, endDate;
    // If weekMenu is true, calculate the start and end dates of the week using moment.js
    const selectedDate = momentTz.tz(date, "MM-DD-YYYY", "America/New_York");

    if (weekMenu) {
      startDate = selectedDate.clone().startOf("week"); // Start of the selected week (Sunday)
      endDate = selectedDate.clone().endOf("week"); // End of the selected week (Saturday)

      const americanStartDate = startDate.format("MM-DD-YYYY");
      const americanEndDate = endDate.format("MM-DD-YYYY");

      const breakfastDatas = await breakfast
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
      const amSnackDatas = await amSnackData
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
      const lunchDatas = await lunchData
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
        const boxLunchesDatas = await boxLunches
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
      const pmSnaks = await pmSnaksData
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
      const supper = await supperData
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();
      const vegetarian = await vegetarianData
        .find({
          date: { $gte: americanStartDate, $lte: americanEndDate },
        })
        .sort({ date: 1 })
        .lean();

      const mergedData = {
        BREAKFAST: breakfastDatas.map((item) => ({
          ...item,
          name: "Breakfast",
        })),
        AMSNACK: amSnackDatas.map((item) => ({ ...item, name: "AM Snack" })),
        LUNCH: lunchDatas.map((item) => ({ ...item, name: "Lunch" })),
        BOXLUNCHES: boxLunchesDatas.map((item) => ({ ...item, name: "Box Lunches" })),
        PMSNACK: pmSnaks.map((item) => ({ ...item, name: "PM snack" })),
        SUPPER: supper.map((item) => ({ ...item, name: "Supper" })),
        VEGETARIAN: vegetarian.map((item) => ({ ...item, name: "Vegetarian" })),
      };

      // Format the date in each item
      Object.keys(mergedData).forEach((key) => {
        mergedData[key].forEach((item) => {
          item.date = moment(item.date).format("MM-DD-YYYY");
        });
      });

      return res.send({
        status: 1,
        message: weekMenu ? "Filter Using Week" : "Filter Using Date",
        data: mergedData,
      });
    } else {
      // When weekMenu is not true, fetch data for multiple dates using $in operator
      const americanDates = date.map((date) =>
        momentTz.tz(date, "MM-DD-YYYY", "America/New_York").format("MM-DD-YYYY")
      );

      console.log("americanDates......", americanDates);

      const breakfastDatas = await breakfast
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
      const amSnackDatas = await amSnackData
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
      const lunchDatas = await lunchData
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
        const boxLunchesDatas = await boxLunches
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
      const pmSnaks = await pmSnaksData
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
      const supper = await supperData
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();
      const vegetarian = await vegetarianData
        .find({ date: { $in: americanDates } })
        .sort({ date: 1 })
        .lean();

      const mergedData = {
        BREAKFAST: breakfastDatas.map((item) => ({
          ...item,
          name: "Breakfast",
        })),
        AMSNACK: amSnackDatas.map((item) => ({ ...item, name: "AM Snack" })),
        LUNCH: lunchDatas.map((item) => ({ ...item, name: "Lunch" })),
        BOXLUNCHES: boxLunchesDatas.map((item) => ({ ...item, name: "Box Lunches" })),
        PMSNACK: pmSnaks.map((item) => ({ ...item, name: "PM snack" })),
        SUPPER: supper.map((item) => ({ ...item, name: "Supper" })),
        VEGETARIAN: vegetarian.map((item) => ({ ...item, name: "Vegetarian" })),
      };

      // Format the date in each item
      Object.keys(mergedData).forEach((key) => {
        mergedData[key].forEach((item) => {
          item.date = moment(item.date).format("MM-DD-YYYY");
        });
      });
      console.log("mergedData.....", mergedData);

      return res.send({
        status: 1,
        message: weekMenu ? "Filter Using Week" : "Filter Using Date",
        data: mergedData,
      });
    }
  } catch (error) {
    console.log("error=>>>", error);
    res.send({ status: 0, message: "Something went wrong" });
  }
};

//mounthly Menu
exports.mounthlyMenu = async (req, res, next) => {
  try {
    const currentMonth = moment().startOf("month");
    const startOfMonth = currentMonth.clone().toDate();
    const endOfMonth = currentMonth.clone().endOf("month").toDate();
    console.log("req........", currentMonth, startOfMonth, endOfMonth);

    //breakFastData
    const breakfastData = await breakfast
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const amSnack = await amSnackData
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const lunch = await lunchData
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const pmsnack = await pmSnaksData
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const vegetarian = await vegetarianData
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const supper = await supperData
      .find({
        date: { $gte: startOfMonth, $lte: endOfMonth },
      })
      .select("-__v")
      .lean();

    const mergedData = {
      BREAKFAST: breakfastData.map((item) => ({ ...item, name: "Breakfast" })),
      AMSNACK: amSnack.map((item) => ({ ...item, name: "AM Snack" })),
      LUNCH: lunch.map((item) => ({ ...item, name: "Lunch" })),
      PMSNACK: pmsnack.map((item) => ({ ...item, name: "PM snack" })),
      SUPPER: supper.map((item) => ({ ...item, name: "Supper" })),
      VEGETARIAN: vegetarian.map((item) => ({ ...item, name: "Vegetarian" })),
    };

    const combinedData = [].concat(...Object.values(mergedData));

    res.json({
      status: 1,
      message: "monthly data ",
      data: combinedData,
    });
  } catch (error) {
    console.log("error=>>>", error);
    res.send({ status: 0, message: "Something went wrong" });
  }
};
