// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';



    
//     cloudinary.config({ 
//         cloud_name: process.env.CLOUD_NAME_CLOUDNIARY, 
//         api_key: process.env.API_KEY_CLOUDNIARY, 
//         api_secret: process.env.API_SCERET_CLOUDNIARY, 
//     });


//       const uplodeImage=async (filepath)=>{
//           try {
//              const uploadResult = await cloudinary.uploader
//        .upload(
//            'filepath', {
//                public_id: 'shoes',
//            }
//        )
//        console.log('uploadResult',  uploadResult )
       
//           } catch (error) {
//             fs.unlinkSync(filepath);
//           }
//       }
   

//       export default uplodeImage

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME_CLOUDNIARY,
  api_key: process.env.API_KEY_CLOUDNIARY,
  api_secret: process.env.API_SCERET_CLOUDNIARY,
});

const uplodeImage = async (filepath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });
      fs.unlinkSync(filepath);

   
   

    return uploadResult;
  } catch (error) {
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    return null;
  }
};

export default uplodeImage;
