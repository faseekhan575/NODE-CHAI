import mongoose from "mongoose";
import bycrypt from "bcrypt"
// import { JsonWebTokenError } from "jsonwebtoken";

const UserSchema= new mongoose.Schema({
         username:{
            type: String,
            required:true,
            uppercase:false, 
            trim:true,
            index:true,
         },
         email:{
             type: String,
            required:true,
            uppercase:false,
            trim:true,
         },
          fullname:{
             type: String,
            required:true,
            uppercase:false,
            trim:true,
         },
         avatar:{
              type: String,
            required:true,
         },
         coverImages:{
          type: String
  //cloudnery url

         },
         passward:{
            type:String,
            required:[true,"plz enter you password first"]
         },
         tokens:{
            type:Number,
            required:true,
         },
         watchhistory:{
            type:mongoose.Schema.ObjectId,
            ref:"Video"
         }


         
         

},{
    timestamps: true
})

UserSchema.pre("save" ,async function (next) {
   if (!this.isModified("passward")) ;
this.passward = await bycrypt.hash(this.passward, 10);


})

UserSchema.methods.isPasswordCorrect = async function (passward) {
    return await bycrypt.compare(passward, this.passward);
}


UserSchema.methods.generateAccessToken=async function (){
   return await jwt.sign({
           _id:this._id,
           username:this.username,
           email:this.email,
           fullname:this.fullname,
    },
     process.env.ACESS_TOKEN,
       {
           expiresIn:process.env.ACESS_TOKEN_EXPIRE
       }
    )
}

UserSchema.methods.generateRefreshToken=async function (){
   return await jwt.sign({
           id:this._id,
           
    },
     process.env.REFRESH_TOKEN,
       {
           expiresIn:process.env.REFRESH_TOKEN_EXPIRE
       }
    
    )
}

const User = mongoose.model("User", UserSchema)
export default User
