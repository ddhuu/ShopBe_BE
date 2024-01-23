'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN:  'ADMIN'
}
class AccessService{
    static signUp = async ({name, email, password}) =>{
        try {
            // check email exists?
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                return{
                    code: 'xxxx',
                    message: 'Shop already registered'
                }
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name,email,password: passwordHash, roles:[RoleShop.SHOP]
            })
            if (newShop)
            {
                // created privateKey, publicKey
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{ modulusLength: 2048})
                
                console.log({privateKey, publicKey}) //save collections keyStore

                const publicKeyString = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey
                })

                if(!publicKeyString){
                    return {
                        code:'xxx',
                        message:'publicKeyString Error'
                    }
                }

                // created token pair
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey)
                console.log(`Create Token Successfully`, tokens)

                return {
                    code : 201,
                    metadata:{
                        shop: newShop,
                        tokens
                    }
                }
                


            }

            return{
                code: 200,
                metadata: null
            }

        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
            
        }
    }
}

module.exports = AccessService