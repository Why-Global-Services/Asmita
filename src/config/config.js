const dotenv = require('dotenv');
const path = require('path');
dotenv.config({path: path.join(__dirname,"../../.env")});
const Joi = require("joi");
const { default: mongoose } = require('mongoose')
console.log(process.env.MONGODB_URL)
const envVarSchema = Joi.object().keys({
    PORT: Joi.number(),
    MONGODB_URL: Joi.string().required().description("MongoDB URL"),
    TOKEN_SECRET: Joi.string().required().description("Jwt secret key"),

    ACCESS_TOKEN_SECRET:Joi.string().required().description("Jwt access secret key"),
    REFRESH_TOKEN_SECRET:Joi.string().required().description("Jwt refresh secret key"),

    SMTP_HOST: Joi.string().description("Email host"),
    SMTP_PORT: Joi.number().description("Smtp port"),
    SMTP_EMAIL_FROM: Joi.string().description("admin email"),
    SMTP_EMAIL_PASS: Joi.string().description("email pass key"),

}).unknown();


const {value:envVars, error} = envVarSchema
.prefs({errors:{label:"key"}})
.validate(process.env);

if(error){
    throw new Error(`Config validation error: ${error.message}`);
}


module.exports = {
    env:envVars.NODE_ENV,
    PORT:envVars.PORT,
    mongoose:{
        url: envVars.MONGODB_URL
    },
    Token:{
        secretKey: envVars.TOKEN_SECRET,
        accessSecretKey: envVars.ACCESS_TOKEN_SECRET,
        refreshSecretKey: envVars.REFRESH_TOKEN_SECRET,
        accessTokenExpiry: '7d',
        refreshTokenExpiry: '7d',
        tokenExpiry:'7d'
    },
    email:{
        smtp:{
            host: envVars.SMTP_HOST,
            port: envVars.SMTP_PORT,
            auth:{
                user: envVars.SMTP_EMAIL_FROM,
                pass: envVars.SMTP_EMAIL_PASS
            }
        }
    }
  
}