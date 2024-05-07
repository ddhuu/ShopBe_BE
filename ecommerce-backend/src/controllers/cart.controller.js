'use strict'

const { SuccessResponse } = require("../core/success.response")
const CartService = require("../services/cart.service")


class Controller{

    addToCart = async (req,res,next) =>{
        new SuccessResponse({
            message:'Create new Cart Success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }


    // update : plus or reduce product
    updateCart = async(req,res,next)=>{
        new SuccessResponse({
            message:'Update Cart Success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    // delete 

    deleteCart = async(req,res,next)=>{
        new SuccessResponse({
            message:'Delete Item From Cart Successfully',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }


    // query


    listToCart = async(req,res,next)=>{
        new SuccessResponse({
            message:'Get List of Cart Successfully',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }

    

}

 module.exports = new Controller()