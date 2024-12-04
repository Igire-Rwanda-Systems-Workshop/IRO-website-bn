import LeaveType from "../../schemas/leaveType.js";


/**
 * Function to add New Leave type
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */


const addLeaveType = async (req, res) => {

  try{
      const {leaveType, description} = req.body
      const insertLeaveType = await LeaveType.create({leaveType, description})

      // if(!insertLeaveType){
      //     return res.status(300).json({message:"Leave Type not added"})
      // }
      return res.status(200).json({message:"leave type added success", status:"Success"})

  }catch(error){
      return res.status(500).json({messae:"Internal server error", error:error.message})
  }

}


  
  

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