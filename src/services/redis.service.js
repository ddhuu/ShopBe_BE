"use strict";

const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2024_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let index = 0; index < retryTimes.length; index++) {
    // Tao mot key, thang nao nam giu dc thi vao thanh toan
    const result = await setnxAsync(key, expireTime);
    console.log(`result:::`, result);

    if (result) {
      // thao tac voi inventory

      return key;
    } else {
      await new Promise((resolve) => setTimeOut(resolve, 50));
    }
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
