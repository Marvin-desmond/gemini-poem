import express from "express"
import PicsController from "../Controller/PicsController"


const router = express.Router()

router.get("/get/:id", PicsController.GetPic)
router.get("/getmeta", PicsController.GetAllPicMeta)
router.post("/create", PicsController.CreatePic)
router.put("/update", PicsController.UpdatePic)
router.delete("/delete/:id", PicsController.DeletePic)

export default router