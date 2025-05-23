const pdf = require("html-pdf-node");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const randomCode = require("../middleware/geretorCode");
const orderModels = require("../models/ordermodel");
const moment = require("moment");
const momentTZ = require("moment-timezone");

async function createPDFS(orderId) {
    const orders = await orderModels
      .findById(orderId)
      .populate({ path: "userId", select: "firstName lastName userImage" })
      .populate({
        path: "addressId",
        select:
          "locationName streetAddress city state zipCode location phoneNumber",
      });
  
      const hotStartTime = moment.utc(orders.startHotTempDateAndTime).tz('America/New_York').format('hh:mm A');
      const hotEndTime = moment.utc(orders.endHotTempDateAndTime).tz('America/New_York').format('hh:mm A');
      const coldStartTime = moment.utc(orders.startColdTempDateAndTime).tz('America/New_York').format('hh:mm A');
      const coldEndTime = moment.utc(orders.endColdTempDateAndTime).tz('America/New_York').format('hh:mm A')
  
      const html =  `<!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Jeffery's Catering - Invoice</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
              }
      
              @media print {
                  * {
                      margin: 0;
                      padding: 0;
                      box-sizing: border-box;
                  }
      
                  @page {
                      size: 350mm auto;
                  }
      
                  html {
                      -webkit-print-color-adjust: exact;
                  }
      
                  body {
                      display: flex;
                      flex-direction: column;
                      min-height: 100vh;
      
                  }
      
                  .invoice_card {
                      width: 100%;
                      font-family: sans-serif;
                      flex: 1;
                  }
      
                  .card_up {
                      padding: 25px;
                      margin-top: 10px;
                      border-radius: 15px 15px 0 0;
                  }
      
                  .card_up>img {
                      width: 100px;
                  }
      
                  .card_header {
                      text-align: left;
                      width: 170px;
                      word-break: break-all;
                      margin: 5px 0;
                  }
      
      
                  .card_header_detail {
                      font-size: 10px;
                      font-weight: 600;
                      margin: 10px;
                  }
      
                  .main_table {
                      width: 100%;
                      border-collapse: collapse;
                      margin: 35px 0;
                      outline: 2px solid #b1005d;
                      outline-offset: 4px;
      
                  }
      
                  .main_table tr {
                      border-bottom: 1px solid #363636
                  }
      
                  .main_table td {
                      padding: 10px;
                      text-align: center;
                      font-size: 9px;
                      max-width: 400px;
                      word-break: break-all;
                  }
      
      
      
                  .main_table th {
                      padding: 8px;
                      text-align: center;
                      font-size: 10px;
                  }
      
                  .table_des {
                      display: flex;
                      gap: 10px;
                      justify-content: center;
                      flex-direction: column;
                      font-weight: 700;
                      padding: 10px;
                  }
      
                  .table_des li {
                      list-style-type: none;
                      padding: 3px;
                      font-weight: 100;
                  }
      
                  .tdata {
                      display: flex;
                      justify-content: space-evenly;
                      padding: 10px 0;
      
                  }
      
                  .tdata li {
                      list-style-type: none;
                  }
      
                  .tdata>span {
                      width: 30%
                  }
      
                  .card_temp {
                      display: flex;
                      justify-content: space-between;
                  }
      
                  .cold_table {
                      width: 250px;
                      background-color: rgb(231, 242, 255);
                      border-radius: 5px;
                      border-collapse: collapse;
                  }
      
                  .cold_table tr {
                      border-bottom: 1px solid #363636
                  }
      
                  .hot_table td,
                  .cold_table td {
                      padding: 7px;
                      text-align: center;
                      font-size: 9px;
                      max-width: 400px;
                      word-break: break-all;
                      border: 1px solid white;
                      border-collapse: collapse;
      
                  }
      
      
      
                  .hot_table th,
                  .cold_table th {
                      padding: 8px;
                      text-align: center;
                      font-size: 10px;
                      border: 1px solid white;
                      border-collapse: collapse;
      
                  }
      
                  .hot_table {
                      width: 300px;
                      border-collapse: collapse;
                      background-color: rgb(255, 237, 237);
                      border-radius: 10px;
                  }
      
                  .card_temp_hot {
                      font-size: 11px;
                      font-weight: 600;
                      margin: 10px;
                      background-color: rgb(199, 66, 66);
                      color: white;
                      border-radius: 5px 5px 0 0;
      
                  }
      
                  .card_temp_cold {
                      font-size: 11px;
                      font-weight: 600;
                      margin: 10px;
                      background-color: rgb(66, 118, 173);
                      color: white;
                      border-radius: 5px 5px 0 0;
                  }
      
                  .card_temp_hot>span,
                  .card_temp_cold>span {
                      color: black;
                      font-size: 10px;
      
                  }
      
                  .card_footer {
                      display: flex;
                      justify-content: space-between;
                      align-items: center;
                      margin-top: auto;
                  }
      
                  .card_footer_data {
                      font-size: 11px;
                      color: #363636;
                      margin-top: 100px;
                      text-align: left;
                      width: 150px
                  }
      
                  .card_footer_data>p {
                      margin: 5px 0;
                  }
      
                  .card_footer_data>img {
                      width: 110px;
      
                  }
              }
      
              .invoice_card {
                  width: 100%;
                  font-family: sans-serif;
                  flex: 1;
              }
      
              .card_up {
                  padding: 25px;
                  margin-top: 10px;
                  border-radius: 15px 15px 0 0;
              }
      
              .card_up>img {
                  width: 100px;
              }
      
              .card_header {
                  text-align: left;
                  width: 170px;
                  word-break: break-all;
                  margin: 5px 0;
              }
      
      
              .card_header_detail {
                  font-size: 10px;
                  font-weight: 600;
                  padding-bottom: 5px;
                  margin: 10px;
                  display: flex;
                  gap: 15px;
                  align-items: center;/
              }
      
              .card_chebox {
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  font-size: 10px;
                  font-weight: 600;
                  margin: 2px 10px;
      
              }
      
              .main_table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 35px 0;
                  outline: 2px solid #b1005d;
                  outline-offset: 4px;
      
              }
      
              .main_table tr {
                  border-bottom: 1px solid #363636
              }
      
              .main_table td {
                  padding: 10px;
                  text-align: center;
                  font-size: 9px;
                  max-width: 400px;
                  word-break: break-all;
              }
      
      
      
              .main_table th {
                  padding: 8px;
                  text-align: center;
                  font-size: 10px;
              }
      
              .table_des {
                  display: flex;
                  gap: 10px;
                  justify-content: center;
                  flex-direction: column;
                  font-weight: 700;
                  padding: 10px;
              }
      
              .table_des li {
                  list-style-type: none;
                  padding: 3px;
                  font-weight: 100;
              }
      
              .tdata {
                  display: flex;
                  justify-content: space-evenly;
                  padding: 10px 0;
      
              }
      
              .tdata li {
                  list-style-type: none;
              }
      
              .tdata>span {
                  width: 30%
              }
      
              .card_temp {
                  display: flex;
                  justify-content: space-between;
              }
      
              .cold_table {
                  width: 300px;
                  background-color: rgb(231, 242, 255);
                  border-radius: 5px;
                  border-collapse: collapse;
              }
      
              .cold_table tr {
                  border-bottom: 1px solid #363636
              }
      
              .hot_table td,
              .cold_table td {
                  padding: 7px;
                  text-align: center;
                  font-size: 9px;
                  max-width: 400px;
                  word-break: break-all;
                  border: 1px solid white;
                  border-collapse: collapse;
      
              }
      
      
      
              .hot_table th,
              .cold_table th {
                  padding: 8px;
                  text-align: center;
                  font-size: 10px;
                  border: 1px solid white;
                  border-collapse: collapse;
      
              }
      
              .hot_table {
                  width: 250px;
                  border-collapse: collapse;
                  background-color: rgb(255, 237, 237);
                  border-radius: 10px;
              }
      
              .card_temp_hot {
                  font-size: 11px;
                  font-weight: 600;
                  margin: 10px;
                  background-color: rgb(199, 66, 66);
                  color: white;
                  border-radius: 5px 5px 0 0;
      
              }
      
              .card_temp_cold {
                  font-size: 11px;
                  font-weight: 600;
                  margin: 10px;
                  background-color: rgb(66, 118, 173);
                  color: white;
                  border-radius: 5px 5px 0 0;
              }
      
              .card_temp_hot>span,
              .card_temp_cold>span {
                  color: black;
                  font-size: 10px;
      
              }
      
              .card_textbox {
                  border-radius: 10px;
                  word-break: break-all;
                  width: 92%
              }
      
              .card_footer {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-top: auto;
              }
      
              .card_footer_data {
                  font-size: 11px;
                  color: #363636;
                  margin-top: 100px;
                  text-align: left;
                  width: 150px
              }
      
              .card_footer_data>p {
                  margin: 5px 0;
              }
      
              .card_footer_data>img {
                  width: 110px;
      
              }
          </style>
      </head>
      
      <body>
      
          <div class="invoice_card">
              <div class="card_up">
                  <img src="http://52.7.244.188:3000/assets/images/LoginLogo.png" alt="">
                  <div class="card_header">
                      <p class="card_header_detail">Delivery Date: ${moment(
                          orders.orderDate
                          ).format("MM-DD-YYYY")}</p>
                      <p class="card_header_detail">Order Created: ${moment
                          .utc(orders.created_at)
                          .tz("America/New_York")
                          .format("MM-DD-YYYY")}
                      </p>
                      <p class="card_header_detail">Customer Name : ${
                          orders.userId.firstName
                          } ${orders.userId.lastName}
                      </p>
                      <p class="card_header_detail">Customer Address: ${
                          orders.addressId.locationName
                          } : ${orders.addressId.streetAddress}, ${
                          orders.addressId.zipCode
                          }, ${orders.addressId.phoneNumber}
                      </p>
                  </div>
                  <table class="main_table">
                      <tr style="background-color: #b1005d;color: #e3e3e3">
                          <th>Order Code</th>
                          <th class="tdata">
                              <span>Meal</span>
                              <span>Qty</span>
                              <span>Items</span>
                          </th>
      
                      </tr>
                      <tr>
                          <td>${orders.orderCode}</td>
                          <td>
                              ${orders.orderItems
                              .map(
                              (orderItem) => `
                              <div class="tdata">
                                  <span>${orderItem.orderType}</span>
                                  <span>${orderItem.quantity}</span>
                                  <span>
                                      <ul>
                                          ${orderItem.orderItem
                                          .map((item) => `<li>${item.items}</li>`)
                                          .join("")}
                                      </ul>
                                  </span>
                              </div>
                              `
                              )
                              .join("")}
                          </td>
                      </tr>
      
                      <tr style="background-color: #b1005d;color: #efefef;">
                          <td colspan="2"></td>
                      </tr>
                  </table>
                  <div class="card_temp">
                      <table class="hot_table">
                          <tr>
                              <th class="card_temp_hot">Hot Start Temp</th>
                              <th class="card_temp_hot">Hot Start Time</th>
                              <th class="card_temp_hot">Hot End Temp</th>
                              <th class="card_temp_hot">Hot End Time</th>
                          </tr>
                          <tr>
                              <td>${orders.startHotTempValue}°F </td>
                              <td>${hotStartTime} </td>
                              <td>${orders.endHotTempValue}°F</td>
                              <td>${hotEndTime} </td>
                          </tr>
                      </table>
                      <table class="cold_table">
                          <tr>
                              <th class="card_temp_cold">Cold Start Temp</th>
                              <th class="card_temp_cold">Cold Start Time</th>
                              <th class="card_temp_cold">Cold End Temp</th>
                              <th class="card_temp_cold">Cold End Time</th>
                          </tr>
                          <tr>
                              <td>${orders.startColdTempValue}°F </td>
                              <td>${coldStartTime} </td>
                              <td>${orders.endColdTempValue}°F</td>
                              <td>${coldEndTime} </td>
                          </tr>
                      </table>
      
                  </div>
      
              </div>
              <p class="card_header_detail" style="
                        display: flex;
                        align-items: center;
                        justify-content: flex-start;
                        gap: 10px;
                    "><input type="checkbox" ${ orders.includePlatesAndNapkins ? "checked" : "" }> Include Plates & Napkins
              </p>
              <p class="card_header_detail" style="border-bottom:1px solid #d6d6d6 ;">Special Instructions : ${
                  orders.description
                  }</p>
              <p class="card_header_detail">Were all regular menu items delivered? :
                  <span class="card_chebox">
                      <input type="checkbox" id="yes" ${ orders.were_all_regular_menu_items_delivered ? "checked" : "" }>
                      <label for="yes">Yes</label>
                  </span>
                  <span class="card_chebox">
                      <input type="checkbox" id="yes" ${ orders.were_all_regular_menu_items_delivered ? "" : "checked" }>
                      <label for="no">No</label>
                  </span>
      
              </p>
              <p class="card_header_detail">Were all modified and vegetarian items delivered? :
                  <span class="card_chebox">
                      <input type="checkbox" id="yes" ${ orders.were_all_modified_and_vegetarian_items_delivered ? "checked"
                          : "" }>
                      <label for="yes"> Yes</label>
                  </span>
                  <span class="card_chebox">
                      <input type="checkbox" id="yes" ${ orders.were_all_modified_and_vegetarian_items_delivered ? ""
                          : "checked" }>
                      <label for="no">No</label>
                  </span>
              </p>
              <p class="card_header_detail">
                  Comment :
                  <span class="card_textbox">${orders.clientComments}</span>
              </p>
      
      
          </div>
      
          </div>
          </div>
          <div class="card_footer">
              <div class="card_footer_data">
                  <p>Address:</p>
                  <p>4415 WHEELER AVE, ALEXANDRIA, VA 22304 703.751.1286</p>
              </div>
              <div class="card_footer_data">
                  <p style="font-weight: 700;">Customer:</p>
                  <p>Name: ${orders.receiveCustomerFirstName} ${
                      orders.receiveCustomerLastName
                      } </p>
                  <p>Signature:</p>
                  <img src="${orders.customerSignature}" alt="" />
              </div>
          </div>
      
      </body>
      
      </html>`
   
      const options = { format: "A4", orientation: "portrait" };
    const file = { content: html };
    const pdfBuffer = await pdf.generatePdf(file, options);
  
    const params = {
      Bucket: "jefferys-s3",
      Key: `invoice_${randomCode.onlyNumber(4)}.pdf`,
      Body: pdfBuffer,
      ACL: "public-read",
      ContentType: "application/pdf",
      ContentDisposition: "inline",
    };
    try {
      const result = await s3.upload(params).promise();
      console.log("File uploaded successfully", result.Location);
      return result.Location;
    } catch (err) {
      console.log("Error occurred while uploading", err);
      throw err;
    }
  }

module.exports = createPDFS;
