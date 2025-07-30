import mongoose ,{Schema} from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema= new Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
    },
    fullname:{
        type:String,
        required:true,

    },
    avatar:{
        type:String,
        default:"https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg"  
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshToken:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }, 
    role: {
    type: String,
    enum: ['guest', 'host', 'admin'],
    default: 'guest',
  },

},{
    timestamps:true,
});

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password=await bcrypt.hash(this.password,10);
    next();  
});
userSchema.methods.isPasswordMatched=async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            isAdmin:this.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
        
    )
}

export const User=mongoose.model('User',userSchema);





