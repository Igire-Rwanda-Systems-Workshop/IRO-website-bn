import { Schema, model } from "mongoose";


const UsersSChema = Schema({
    // supervisorId:{type: Schema.Types.ObjectId, ref: "Users"},
    supervisorId:{type: String},
    firstName: {type:String, required :true},
    lastName:{type:String, required :true},
    email:{type:String, required :true, unique: true},
    position:{type:String},
    gender:{type:String},
    telephone:{type:String},
    status:{type:String, default:"Active"},
    role:{type:String, default:"Employee"},
    password:{type:String, required:true},
    
})

const Users = model("Users",UsersSChema)

export default Users