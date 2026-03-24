require("dotenv").config()

// skapa en express app
const express = require("express")
const app = express()

// importera mongoose
const mongoose = require("mongoose")

// express att förstå json
app.use(express.json())

// anslut till mongoose/mongodb
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Ansluten till MONGODB"))
    .catch(err => console.log("Fel:", err))

// mall som beskriver hur datan ska se ut i databasen
const receptSchema = new mongoose.Schema({
    namn: String, //namn på recept
    ingredienser: [String], //lista med ingredienser
    instruktioner: String, //instruktioner
    tid: Number // antal minuter, måste vara tal
})
    
const Recept = mongoose.model("Recept", receptSchema)

// GET - hämta alla recept
app.get("/recept", async (req, res) => {
    try {
        const recept = await Recept.find()
        res.json(recept)
    } catch (fel) {
        res.status(500).json({ meddelande: "Något gick fel" })
    }
})

// POST - skapa ett nytt recept
app.post("/recept", async (req, res) => {
    try {
        const nyttRecept = new Recept({
            namn: req.body.namn,
            ingredienser: req.body.ingredienser,
            instruktioner: req.body.instruktioner,
            tid: req.body.tid
        })
        await nyttRecept.save()
        res.status(201).json(nyttRecept)
    } catch (fel) {
        res.status(500).json({ meddelande: "Något gick fel" })
    }
})

// GET - hämta ett specifikt recept
app.get("/recept/:id", async (req, res) => {
    try {
        const recept = await Recept.findById(req.params.id)
        if (!recept) {
            res.status(404).json({ meddelande: "Recept hittades inte" })
        } else {
            res.json(recept)
        }
    } catch (fel) {
        res.status(500).json({ meddelande: "Något gick fel" })
    }
})

// PUT - uppdatera ett recept
app.put("/recept/:id", async (req, res) => {
    try {
        const uppdaterat = await Recept.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.json(uppdaterat)
    } catch (fel) {
        res.status(500).json({ meddelande: "Något gick fel" })
    }
})

// DELETE - ta bort ett recept
app.delete("/recept/:id", async (req, res) => {
    try {
        await Recept.findByIdAndDelete(req.params.id)
        res.json({ meddelande: "Recept borttaget" })
    } catch (fel) {
        res.status(500).json({ meddelande: "Något gick fel" })
    }
})

app.listen(3000, () => {
    console.log("Servern körs på http://localhost:3000")
})