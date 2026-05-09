const axios=require('axios')
require('dotenv').config();
const BASE_URL=process.env.BASE_URL;
const TOKEN=process.env.TOKEN;

if(!TOKEN || !BASE_URL){
    console.warn("warining token is missing ");
}

const Log=async(stack,level,packageName,message)=>{
    if (!TOKEN || !BASE_URL) {
        return;
    }

    try 
    {
        const payload={stack: stack.toLowerCase(),
            level :level.toLowerCase(),
            package:packageName.toLowerCase(),
            message:message.toString().substring(0, 48)
        };
        await axios.post(`${BASE_URL}/logs`,payload,{
            headers:{
                Authorization:`Bearer ${TOKEN}`,
                'Content-Type':'application/json'
            }
        });
    }catch(e){
        // i silent the error, bcoz i need a new token 
    }
};

module.exports=Log;