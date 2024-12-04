import { Schema,model } from "mongoose";

const leaveSchema = Schema({
    userId: {type:Schema.ObjectId, ref: "Users", required:true},
    leaveTypeId: { type: Schema.ObjectId, ref: "LeaveType", required: true },
    firstName: { type: String,required:true },
    lastName:{type: String ,required:true},
    description:{type:String, required:true},
    startDate:{type: String},
    endDate:{type: String},
    numberOfDays:{type: Number},
    status:{type:String, default:"Pending"},
    hrStatus: {type:String, default:"Pending"},
    supervisorStatus: {type:String, default:"Pending" }
})

const Leave = model("Leave", leaveSchema)

export default Leave