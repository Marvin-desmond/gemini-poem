import express from "express"
import PoemsController from "../Controller/PoemsController"

const router = express.Router()

router.post("/create", PoemsController.CreatePoem)
router.get("/get/:id", PoemsController.GetPoem)
router.get("/", PoemsController.GetPoems)

export default router 

// router.route("/").get(PoemsController.GetPoems)
// router.route("/create").get(PoemsController.CreatePoem)
