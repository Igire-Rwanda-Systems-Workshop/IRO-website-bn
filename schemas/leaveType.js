import { Schema, model } from "mongoose";

const LeaveTypeSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    leaveType: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const LeaveType = model("LeaveType", LeaveTypeSchema);

export default LeaveType;
