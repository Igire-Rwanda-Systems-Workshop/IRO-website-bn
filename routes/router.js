import { Router } from "express";
import Ac from "../controllers/HR/accountController.js"
import Emp from "../controllers/HR/viewEmployees.js"
import Leave from "../controllers/leaveType/leaveTypesCtl.js"
import manageEmployees from "../controllers/HR/manageEmployees.js";
import manageRequest from "../controllers/HR/manageRequest.js";
import Employees from "../controllers/employees.js";
import managePassword from "../controllers/managePassword.js";

const router = Router()

// hr/admin routes
router.post("/auth/register", Ac.register)
router.post("/auth/login", Ac.login)
router.put("/employee/:id/make-admin", Ac.makeUserAdmin)
router.put("/employee/:id/make-supervisor", Ac.makeSupervisor)
router.put("/employee/:id/remove-privillage", Ac.revokePrevilage)
router.put("/employee/:id/lock", Ac.lockAccount)
router.put("/employee/:id/unlock", Ac.unLockAccount)
router.get("/get/employee/:id", Emp.getUserById)
router.get("/getAll/employee", Emp.getAllEmployees)
router.get("/leave-requests/status", Employees.getLeaveRequestSummary)


// ADDING NEW LEAVE TYPE
router.post("/addLeaveType/", Leave.addLeaveType)
router.get( "/getAll/leave", Leave.getLeaveTypes )
router.put( "/updateLeaveType/:id", Leave.updateLeaveType )
router.delete( "/deleteLeaveType/:id", Leave.deleteLeaveType )
router.get("/getleaveType/:id", Leave.getLeaveTypeById)


// MANAGE ACCOUNT
router.put("/update/employee/:id", manageEmployees.updateEmployee)
router.delete("/employee/:id", manageEmployees.deleteEmployee)
router.post("/forget-password", managePassword.forgotPassword)
router.put("/reset-password/:token", managePassword.updatePassword)

// MANAGING LEAVE REQUEST
router.get("/leave-requests", manageRequest.viewAllRequest)
router.post("/leave-requests", manageRequest.sendRequest)
router.put("/leave-requests/:id/approve", manageRequest.confirmRequest)
router.put("/leave-requests/:id/deny", manageRequest.denyRequest)
router.get("/leave-requests/employee/:employeeId", Employees.viewMyRequest)
router.put("/leave-requests/:id/cancel", Employees.cancelRequest)

export default router