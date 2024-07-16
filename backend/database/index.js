const mongoose=require("mongoose");
const { MONGODB_CONNECTION }=require("../config/index")


const dbConnect=async ()=>{
    
    try {
        const conn=await mongoose.connect(MONGODB_CONNECTION)
        console.log(`Database connnect to host: ${conn.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error}`)
    }
}

module.exports=dbConnect;