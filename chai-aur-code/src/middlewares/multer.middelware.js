import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  },
  // FileFilter :function (req,file,cb){
  //   if (file.nimetype ==="image/png "){
  //       cb(null,true),
  //       console.log(file);}
  //       else{
  //        cb (new Error("only png  files are allowed"),false)
  //       }
  //   }
  }
);

export const upload = multer({
     storage,
     })