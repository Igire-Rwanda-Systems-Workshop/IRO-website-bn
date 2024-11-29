// import Product from "../models/product.js" 
// import moment from 'moment';

// exports.getProductStatusByMonth = async (req, res) => {
//   try {
//     // Default to current year and month if not provided
//     const year = parseInt(req.query.year) || new Date().getFullYear();
//     const month = parseInt(req.query.month) || new Date().getMonth() + 1;

//     // Determine the number of days in the month
//     const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();

//     // Create an array to store daily aggregations
//     const dailyStatus = [];

//     // Aggregate status for each day of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const startDate = moment(`${year}-${month}-${day}`, "YYYY-MM-DD").startOf('day').toDate();
//       const endDate = moment(`${year}-${month}-${day}`, "YYYY-MM-DD").endOf('day').toDate();

//       const statusAggregation = await Product.aggregate([
//         {
//           $match: {
//             dateOfEntry: {
//               $gte: startDate,
//               $lte: endDate
//             }
//           }
//         },
//         {
//           $group: {
//             _id: null,
//             borrowed: { 
//               $sum: { $cond: [{ $eq: ['$status', 'borrowed'] }, 1, 0] } 
//             },
//             stolen: { 
//               $sum: { $cond: [{ $eq: ['$status', 'stolen'] }, 1, 0] } 
//             },
//             damaged: { 
//               $sum: { $cond: [{ $eq: ['$status', 'damaged'] }, 1, 0] } 
//             },
//             available: { 
//               $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] } 
//             }
//           }
//         }
//       ]);

//       dailyStatus.push({
//         dayofweek: moment(`${year}-${month}-${day}`).day(), // 0 (Sunday) to 6 (Saturday)
//         borrowed: statusAggregation[0]?.borrowed || 0,
//         stolen: statusAggregation[0]?.stolen || 0,
//         damaged: statusAggregation[0]?.damaged || 0,
//         available: statusAggregation[0]?.available || 0
//       });
//     }

//     res.json({
//       message: 'Product status retrieved successfully',
//       data: dailyStatus
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error retrieving product status',
//       error: error.message
//     });
//   }
// };