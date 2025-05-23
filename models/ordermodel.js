const mongoose = require('mongoose')
// const userdata= require('../models/usermodel')

const orderSchema = new mongoose.Schema({
  orderCode: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userdata'
  },
  orderItems: [
    {
      orderType: {
        type: String,
        enum: [
          'Breakfast',
          'Box Lunches',
          'Lunch',
          'PM snack',
          'Supper',
          'Vegetarian',
          'AM Snack'
        ]
      },
      quantity: {
        type: String
      },
      // menuDate: {
      //   type: String
      // },
      orderItem: [
        {
          items: {
            type: String
          }
        }
      ]
    }
  ],
  orderDate: {
    type: Date
  },
  description: {
    type: String
  },
  includePlatesAndNapkins: {
    type: Boolean
  },
  isOrderAssign: {
    type: String,
    enum: ['Assigned', 'Not Assigned'],
    default: 'Not Assigned'
  },
  orderStatus: {
    enum: ['Upcoming', 'Delivered', 'Cancelled'],
    type: String,
    default: 'Upcoming'
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userAddressModel'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'driverModel'
  },
  orderOtp: {
    type: String
  },
  startHotTempValue: {
    type: Number,
    default: 0
  },
  endHotTempValue: {
    type: Number,
    default: 0
  },
  startColdTempValue: {
    type: Number,
    default: 0
  },
  endColdTempValue: {
    type: Number,
    default: 0
  },
  orderPlacingDate: {
    type: Date
  },
  startHotTempDateAndTime: {
    type: Date
  },
  endHotTempDateAndTime: {
    type: Date
  },
  startColdTempDateAndTime: {
    type: Date
  },
  endColdTempDateAndTime: {
    type: Date
  },
  clientComments:{
    type:String
  },
  were_all_regular_menu_items_delivered:{
    type:Boolean
  },
  were_all_modified_and_vegetarian_items_delivered:{
    type:Boolean
  },
  receiveCustomerFirstName: {
    type: String
  },
  receiveCustomerLastName: {
    type: String
  },
  customerSignature: {
    type: String
  },
  isCustomerConfirmation: {
    type: Boolean,
    default: false
  },
  orderPDF: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date
  }
})

orderSchema.index({ location: '2dsphere' })

const orderData = new mongoose.model('orderData', orderSchema)
module.exports = orderData
