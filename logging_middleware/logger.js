const axios=require('axios')
require('dotenv').config();
const BASE_URL=process.env.BASE_URL;
const TOKEN=process.env.TOKEN;

if(!TOKEN){
        console.log("Token is missing, please check it once")
}

const Log=async(stack,level,packageName,message)=>{


    try 
    {
        const payload={stack: stack.toLowerCase(),
            level :level.toLowerCase(),
            package:packageName.toLowerCase(),
            message:message.toString()
        };
        await axios.post(`${BASE_URL}/logs`,payload,{
            headers:{
                Authorization:`Bearer${TOKEN}`,
                'Content-Type':'application/json'
            }
        });
        console.log(level.toUpperCase());
        console.log(packageName)
        console.log(message);
    }catch(e){
        console.error("Error in Logger.js file",e)
    }
};

module.exports=Log;