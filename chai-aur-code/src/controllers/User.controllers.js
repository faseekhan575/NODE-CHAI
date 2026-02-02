import { asynchandler } from "../utils/asynchandler.js";


const registerUser= asynchandler( async (req,res)=>{
    res.status(200).json({
        message:"ok"
    })


})

///mine partice
export const createproduct= asynchandler( async (req,res)=>{
        if (!req.body.name){
        res.status(400).json({
            message :"missing plz add name to create product "
        })
       }
       else{
        res.status(201).json({
          message:"product created sucessfully"
        })
       }
})

export default registerUser;