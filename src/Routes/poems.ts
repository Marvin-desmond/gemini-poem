import express from "express"
import PoemsController from "../Controller/PoemsController"

const router = express.Router()

router.post("/create", PoemsController.CreatePoem)
router.put("/update", PoemsController.UpdatePoem)
router.get("/get/:id", PoemsController.GetPoem)
router.get("/", PoemsController.GetPoems)
router.delete("/delete/:id", PoemsController.DeletePoem)

export default router 

// router.route("/").get(PoemsController.GetPoems)
// router.route("/create").get(PoemsController.CreatePoem)
