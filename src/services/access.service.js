'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils") 
const { getInfoData } = require("../utils")
const { BadRequestError } = require("../../core/error.response")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN:  'ADMIN'
}
class AccessService{
    static signUp = async ({name, email, password}) =>{
        // try {
            // check email exists?
            const holderShop = await shopModel.findOne({email}).lean()
            if(holderShop){
                throw new BadRequestError('Error: Shop Already Registered')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name,email,password: passwordHash, roles:[RoleShop.SHOP]
            })
            if (newShop)
            {
                // created privateKey, publicKey

                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa',{ 
                //     modulusLength: 2048,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                
                // })

                const privateKey =  crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                
                console.log({privateKey, publicKey}) //save collections keyStore

                const keyStore = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey
                })


                if(!keyStore){
                    throw new BadRequestError('Error: Create KeyStore Failed')
                }
                // created token pair
                const tokens = await createTokenPair({userID: newShop._id, email},publicKey , privateKey)
                console.log(`Create Token Successfully`, tokens)

                return {
                    code : 201,
                    metadata:{
                        shop: getInfoData({fields:['_id','name','email'], object: newShop}),
                        tokens
                    }
                }
                


            }

            return{
                code: 200,
                metadata: null
            }

        // } catch (error) {
        //     console.error(error)
        //     return {
        //         code: 'xxx',
        //         message: error.message,
        //         status: 'error'
        //     }
            
        // }
    }
}

module.exports = AccessService