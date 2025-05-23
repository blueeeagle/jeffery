const addBreakfast = require('../../../models/addbreakfast')
const addLunch = require('../../../models/addlunch')
const pmSnack = require('../../../models/addpmsnake')

const moment = require('moment');

exports.addMenu = async (req, res, next) => {
    try {

        console.log("req.body+>>>", req.body)
        console.log("body=>>>", req.body.date)

        const formattedDate = moment(req.body.date).format('DD-MM-YYYY');
        console.log("formattedDate=>>", formattedDate)

        // const data = [req.body.option]
        // var arr = []
        const data = Array.isArray(req.body.option) ? req.body.option : [req.body.option]; // Ensure data is an array
        const arr = data.map(item => ({ items: item }));


        const addBreakfasts = new addBreakfast({
            categoryId: "6516bd6c062cc562bf14348a",
            date: req.body.date,
            item: arr,
            normalDate: formattedDate

        })

        console.log("addBreakfasts=>>", addBreakfasts)

        const addLunchs = new addLunch({
            categoryId: "6516bb717866404ee4bfdb17",
            date: req.body.date,
            item: arr,
            normalDate: formattedDate

        })
        console.log("addLunchs", addLunchs)

        const addPmSnacks = new pmSnack({
            categoryId: "6516bda2062cc562bf14348e",
            date: req.body.date,
            item: arr,
            normalDate: formattedDate


        })

        console.log("addPmSnacks=>>", addPmSnacks, "addBreakfasts=>>>>", addBreakfasts, "addLunchs=>>>>", addLunchs)



        // await addBreakfasts.save()
        // await addLunchs.save()
        // await addPmSnacks.save()
        // res.redirect('/addmenu')

    }

    catch (error) {
        console.log(error)
        res.redirect('/addmenu')


    }
}