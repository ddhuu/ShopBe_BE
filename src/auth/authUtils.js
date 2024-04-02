"use strict";

const JWT = require("jsonwebtoken");

const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //access token
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log(`Error Verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
    I- Check userId missing ?
    II- Get Access Token
    III - Verify token
    IV - Check user in DB
    V - Check key SOtre with user ID
    VI - OK => return next()
    */
  const userId = req.headers[HEADER.CLIENT_ID];
  if(!userId) throw new AuthFailureError('Invalid Request')

  const keyStore = await KeyTokenService.findByUserId(userId)
  if(!keyStore) throw new NotFoundError('Not Found keyStore')

  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if(!accessToken) throw new AuthFailureError('Invalid Request')
  
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId != decodeUser.userId) throw new AuthFailureError('Invalid User')
    req.keyStore = keyStore
    req.user = decodeUser
    return next()
  } catch (error) {
    throw error
  }


});
module.exports = {
  createTokenPair,
  authentication
};
