import express from "express"
import PicsController from "../Controller/PicsController"


const router = express.Router()

router.get("/get/:id", PicsController.GetPic)
router.post("/create", PicsController.CreatePic)
router.delete("/delete/:id", PicsController.DeletePic)

export default router