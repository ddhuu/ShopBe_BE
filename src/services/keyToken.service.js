'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService{
    static createKeyToken = async ({userID, publicKey,privateKey}) =>{
        try {
            const tokens = await keytokenModel.create({
                user: userID,
                publicKey,
                privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }   
}

module.exports = KeyTokenService