import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";




    const connect= async () => {
    
        try {
            const mongoose_DB_connect= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
            console.log(`\n Connected to MongoDB :${mongoose_DB_connect.connection.host}\n`);
        } catch (error) {
         console.log(error);
         
         process.exit(1); 
        }
    
}

export default connect



