import express from "express"
import ImaginesController from "../Controller/ImaginesController"


const router = express.Router()

router.put("/update/:id", ImaginesController.UpdateImagine)
router.get("/", ImaginesController.GetImagines)

export default router