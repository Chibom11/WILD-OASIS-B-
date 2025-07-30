import jwt from 'jsonwebtoken';

export const checkAccessToken=(req,res,next)=>{
    const storedAccessToken=req.cookies.accessToken;
    if(!storedAccessToken){
        return res.status(400).json({success:false,message:"Access token is missing"});
    }

    try {
        const decodedAccessToken=jwt.verify(storedAccessToken,process.env.ACCESS_TOKEN_SECRET);
        req.user=decodedAccessToken;
        next();//proceed to route
        
    } catch (error) {
        return res.status(401).json({success:false,message:"Invalid access token"});
        
    }
}

 