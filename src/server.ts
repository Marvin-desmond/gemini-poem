import express from "express"
import cors from "cors"
import morgan from "morgan"

import poems from "./Routes/poems"
import imagines from "./Routes/imagines"

const app = express()

app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use("/api/poems", poems)
app.use("/api/imagines", imagines)
app.use(express.static('public'))

app.use("/", express.static("build"))
app.use("*", (req, res) => res.status(404).json({ error: "not found" }))

export default app