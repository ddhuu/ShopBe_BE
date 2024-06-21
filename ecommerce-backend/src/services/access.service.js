"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({ delKey });
    return delKey;
  };
  static login = async ({ email, password, refreshToken = null }) => {
    /*
        1 - Check email in dbs
        2 - Match Password
        3 - Create AT and RT and save
        4 - Generate Token
        5 - Get data
        */
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError(`Shop not Registered`);
    }

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair({ userId }, publicKey, privateKey);

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
      userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    try {
      // check email exists?
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop Already Registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (!newShop) {
        throw new BadRequestError("Error: Shop Creation Failed");
      }

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStore = await KeyTokenService.createKeyToken({
        userID: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Create KeyStore Failed");
      }

      const tokens = await createTokenPair(
        { userID: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        code: 500,
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
