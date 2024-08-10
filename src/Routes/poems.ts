import express from "express"
import PoemsController from "../Controller/PoemsController"

const router = express.Router()

import multer from "multer"

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post("/create", PoemsController.CreatePoem)
router.put("/update", PoemsController.UpdatePoem)
router.get("/get/:id", PoemsController.GetPoem)
router.get("/", PoemsController.GetPoems)
router.delete("/delete/:id", PoemsController.DeletePoem)
router.post("/extract", upload.single('image'), PoemsController.PoemFromFile)
export default router 

// router.route("/").get(PoemsController.GetPoems)
// router.route("/create").get(PoemsController.CreatePoem)
