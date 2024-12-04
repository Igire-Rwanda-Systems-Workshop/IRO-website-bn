import { Schema,model } from "mongoose";


const leaveTypeSchema = Schema({
    leaveType:{type:String, required: true},
    description:{type:String, required: true},
})


const LeaveType = model("LeaveType", leaveTypeSchema)

export default LeaveType