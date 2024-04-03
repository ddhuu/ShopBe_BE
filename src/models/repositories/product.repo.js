'use strict'

const { product } = require("../product.model")

const findAllDraftsForShop = async({query, limit, skip})=>{
    return await product.find(query).
    populate('product_shop','name email -_id')
    .sort({updateAt: -1})
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
    findAllDraftsForShop
}