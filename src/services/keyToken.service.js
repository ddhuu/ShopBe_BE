'use strict'

const keytokenModel = require("../models/keytoken.model")

class KeyTokenService{
    static createKeyToken = async ({userID, publicKey}) =>{
        try {
            const publicKeyString = publicKey.toString()
            const tokens = await keytokenModel.create({
                user: userID,
                publicKey: publicKeyString
            })

            return token ? publicKeyString : null
        } catch (error) {
            return error
        }
    }   
}

module.exports = KeyTokenService