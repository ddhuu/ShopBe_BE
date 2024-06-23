const AccessControl = require("accesscontrol");

// const grantList = [
//   {
//     role: "admin",
//     resource: "profile",
//     action: "update:any",
//     attributes: "*, !views",
//   },
//   {
//     role: "shop",
//     resource: "profile",
//     action: "read:own",
//     attributes: "*",
//   },
// ];

module.exports = new AccessControl();
