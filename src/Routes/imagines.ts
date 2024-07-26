import express from "express"
import ImaginesController from "../Controller/ImaginesController"


const router = express.Router()

router.post("/create/:id", ImaginesController.CreateImagine)
router.put("/update/:id", ImaginesController.UpdateImagine)
router.get("/", ImaginesController.GetImagines)

export default router