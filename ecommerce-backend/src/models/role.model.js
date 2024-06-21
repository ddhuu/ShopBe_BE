"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Role";
const COLLECTION_NAME = "Roles";

// const grantList = [
//   { role: "admin", resource: "profile", action: "update:any", attributes: "*" },
//   {
//     role: "shop",
//     resource: "balance",
//     action: "update:own",
//     attributes: "*,!amount",
//   },
//   { role: "user", resource: "profile", action: "read:own", attributes: "*" },
// ];

const RoleSchema = new Schema(
  {
    rol_name: {
      type: String,
      default: "user",
      enum: ["user", "admin", "shop"],
    },
    rol_slug: { type: String, required: true }, // 0x0y0z
    rol_status: {
      type: String,
      default: "active",
      enum: ["active", "block", "pending"],
    },
    rol_description: { type: String, default: "" },
    rol_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [{ type: String, required: true }],
        attributes: [{ type: String, default: "*" }],
      },
    ],
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, RoleSchema);
