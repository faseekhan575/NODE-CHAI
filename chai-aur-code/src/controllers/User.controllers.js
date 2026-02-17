import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiErrors.js"
import User from "../models/user.models.js"
import ApiResponse from "../utils/Api_Respoonse.js";
import uplodeImage from "../models/cloudniary.js";
import jwt from "jsonwebtoken"

const registerUser = asynchandler(async (req, res) => {
    const { username, fullname, email, passward } = req.body;




    console.log("req.files:", req.files);
    console.log("req.body:", req.body);


    if (!username || !fullname || !email) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    // not AI finding user if already login with same email or username using $or oprater its 
    // a mongoose method
    const findinguser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (findinguser) {
        throw new ApiError(409, "User with this email already exists")
    }


    const avatarPath = req.files?.avatar?.[0]?.path;
    const coverPath = req.files?.coverImages?.[0]?.path;


    if (!avatarPath || !coverPath) {
        throw new ApiError(400, "plz first uplode avatar file")
    }

    const avatar = await uplodeImage(avatarPath)
    const coverIamges = await uplodeImage(coverPath)


    if (!avatar || !coverIamges) {
        throw new ApiError(400, "plz first uplode avatar file")
    }

    const users = await User.create({
        fullname,
        avatar: avatar.url,
        coverImages: coverIamges.url, // match schema field name
        email,
        passward,
        username,
        tokens: 0
    });

    console.log("FILES:", req.files);
    console.log("AVATAR PATH:", req.files?.avatar?.[0]?.path);
    console.log("COVER PATH:", req.files?.coverImages?.[0]?.path);

    const createuser = await User.findById(users._id).select("-passward -tokens");


    if (!createuser) {
        throw new ApiError(500, "there is error while svaing user plz try again clam!!!")
    }

    res.status(201).json({
        message: new ApiResponse(201, createuser, "user created sucessfully")
    })




})

//making data for refresh token and acess token by me not A-I

const  GenrateAccessandRefershToken=async(UserId)=>{
   try {
        const user=await User.findById(UserId)
        const accesstoken= user.generateAccessToken()
        const refreshtoken= user.generateRefreshToken()

        user.refreshtoken=refreshtoken
        await user.save({validateBeforeSave:false})

        return{accesstoken,refreshtoken}

    } catch (error) {
        throw new ApiError(500, 
            "something went wrong while genrating the acess token and refresh token")

    }
}


const LoginUser=asynchandler(async(req,res)=>{

    const {username,email,passward}=req.body
      
    if (!(username || email) || !passward){
        res.status(401).json({
            message:"plz enter user name and email to continue first"
        })
    }

    const checkUser=await User.findOne({
        $or:[{username},{email}]
    })

    if (!checkUser){
        res.status(401).json({
            message:"username and passward doesnt exist to Login"
        })
    }
      
    const passwardValidation=await checkUser.isPasswordCorrect(passward)

    if (!passwardValidation){
          res.status(401).json({
            message:"plz enter correct one passward to continue"
        })
    }

    const {accesstoken,refreshtoken}=await GenrateAccessandRefershToken(checkUser._id)

    const LoggedinUser= await User.findById(checkUser._id).select(
        "-passward -tokens"
    )
 
      
   const options = {
    httpOnly: false,
    secure: false,  // must be false for local/dev
    sameSite: "lax"
};
    return res.
    status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json (new ApiResponse(200,{
        user: LoggedinUser,accesstoken,refreshtoken
    },"user logged in sucesfully"

))
})
const LogoutUser = asynchandler(async (req, res) => {
    // Clear refresh token in DB
    await User.findByIdAndUpdate(req.user._id, {
        $set: { refreshtoken: null }
    }, { new: true });

const options = {
    httpOnly: false,
    secure: false,  // must be false in local/dev
    sameSite: "lax"
};



    return res
        .status(200)
        .clearCookie("accesstoken", options)
          .clearCookie("refreshtoken", options)
        .json({
            success: true,
            message: "User logged out successfully"
        });
});



///mine partice
export const createproduct = asynchandler(async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({
            message: "missing plz add name to create product "
        })
    }
    else {
        res.status(201).json({
            message: "product created sucessfully"
        })
    }


})

export const generateRefreshToken=asynchandler(async(res,req)=>{

     const genratingrefreshtoken = req.cookie.refreshtoken || req.body.refreshtoken

     if (!genratingrefreshtoken){
        throw new ApiError(401,"unathroized user acess")
     }

     const verifyrefreshtoken = jwt.verify(genratingrefreshtoken,process.env.REFRESH_TOKEN)

     if (!verifyrefreshtoken){
         throw new ApiError(401,"unmatched token")
     }
      
     const finduser=User.findById(verifyrefreshtoken._id)

     if (!finduser){
        throw new ApiError(401,"user not found")
     }

     if (verifyrefreshtoken!=User?.tokens){
         throw new ApiError(401,"token you use is expired")
     }

     const options={
        httpsOnly:true,
        secure: false,
     }

     const {accesstoken,refreshtoken}=await GenrateAccessandRefershToken(User._id)

     return res
      .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(
            200,{
                accesstoken,
                refreshtoken
            },"refresh token done..."
        )
    )

     




})


//video 14 work


export default registerUser;
export {LoginUser}
export {GenrateAccessandRefershToken}
export {LogoutUser}
export {generateRefreshToken}


