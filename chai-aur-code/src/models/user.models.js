import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

UserSchema.pre("save", async function () {
    // Only hash the password if it’s new or modified
    if (!this.isModified("passward")) return;

    this.passward = await bcrypt.hash(this.passward, 10);
});


UserSchema.methods.isPasswordCorrect = async function(passward){
    return await bcrypt.compare(passward, this.passward)
}



UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
const User = mongoose.model("User", UserSchema)
export default User
