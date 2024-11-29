import LeaveType from "../../schemas/leaveType.js";
import { v4 as uuidv4 } from "uuid"; 

/**
 * Function to add New Leave type
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */


const addLeaveType = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate inputs
    if (!id) {
      return res.status(400).json({
        message: "Leave type and description are required",
        status: "Fail",
      });
    }

    // Generate or use provided ID
    const uniqueId = id || uuidv4();

    // Check for duplicate leave type or ID
    const existingLeaveType = await LeaveType.findOne({
      $or: [ { id: uniqueId }],
    });
    if (existingLeaveType) {
      return res.status(400).json({
        message: "Leave type or ID already exists",
        status: "Fail",
      });
    }

    // Insert new leave type
    const insertLeaveType = await LeaveType.create({
      id: uniqueId,
    });

    return res.status(201).json({
      message: "Leave type added successfully",
      status: "Success",
      data: insertLeaveType,
    });

  } catch (error) {
    if (error.code === 11000) {
      // Handle MongoDB duplicate key error
      return res.status(400).json({
        message: "Leave type or ID already exists",
        status: "Fail",
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

  
  

// update leave type
const updateLeaveType = async ( req, res ) =>
{
    try
    {
        const { leaveType, description } = req.body;
        const id = req.params.id;
        const updatedLeaveType = await LeaveType.findByIdAndUpdate( id, { leaveType, description }, { new: true } );
        
        if(!updatedLeaveType){
            return res.status(404).json({message:"Leave type not found"})
        }
        return res.status( 200 ).json( { message: "Leave type updated successfully", leaveType: updatedLeaveType } )
    }
    catch ( error )
    {
        return res.status( 500 ).json( { message: "Internal server error", error: error.message } )
    }
    }
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns {}
 */
const getLeaveTypes = async (req, res) => {
    try{
        const leaveTypes = await LeaveType.find()
        if(leaveTypes.length >=1){
            return res.status(200).json({message:"Successfull", leaveTypes})
        }
        return res.status(200).json({message:"No leaveType recorded"})
    }catch(error){
        return res.status("500").json({message:"Internal server error", error:error.message})
    }


}

// delete leave type
const deleteLeaveType = async ( req, res ) =>
    {
        try
        {
            const id = req.params.id;
            const deletedLeaveType = await LeaveType.findByIdAndDelete( id );
            
            if(!deletedLeaveType){
                return res.status(404).json({message:"Leave type not found"})
            }
            return res.status( 200 ).json( { message: "Leave type deleted successfully" } )
        }
        catch ( error )
        {
            return res.status( 500 ).json( { message: "Internal server error", error: error.message } )
        }
}

// get leave type by id
const getLeaveTypeById = async ( req, res ) =>
{
    try
    {
        const id = req.params.id;
        const leaveType = await LeaveType.findById( id );
        
        if(!leaveType){
            return res.status(404).json({message:"Leave type not found"})
        }
        return res.status( 200 ).json( { message: "Leave type found", leaveType } )
    }
    catch ( error )
    {
        return res.status( 500 ).json( { message: "Internal server error", error: error.message } )
    }

}

    



export default {addLeaveType, getLeaveTypes,updateLeaveType,deleteLeaveType,getLeaveTypeById}