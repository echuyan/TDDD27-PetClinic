const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

router.use(bodyParser.json()); 

router.get("/Pets/GetPet/:petId", async (req, res) => {
  console.log(req);
  const id = req.params.petId;
  console.log(id);
  const sql = "SELECT * FROM pets WHERE id = ?";
  const getPet = await db.getAsync(sql, id);

  if (getPet === undefined) {
    
    res.json({
        message: "No such pet",
    });
  } else {
    res.json({
       pet: getPet, 
    });
      }

  });


  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../../client/src/static")); 
    },
    filename: (req, file, cb) => {
      const fileName = `/${Date.now()}_${file.originalname}`;
      cb(null, fileName);
    },
  });
  
  const upload = multer({ storage });

  router.post("/Pets/UpdatePet", upload.single("photo"), async (req, res) => {
    const id = req.body.petId;
    const name = req.body.name;
    const species = req.body.species;
    const dateOfBirth = req.body.dateOfBirth;
    const photo =  req.file ? req.file.filename : null;
    const sql = "UPDATE pets SET name = ?, species = ?, dateOfBirth = ?, photo = ? WHERE id = ?";
  
    try {
      await db.runAsync(sql, [name, species, dateOfBirth, photo, id]);
  
      res.json({ message: "Pet updated successfully" });
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Failed to update pet", detailedError: error.message });
    }
  });

  router.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error", detailedError: err.message });
  });


  router.post("/Pets/AddPet", upload.single("photo"), async (req, res) => {
    const id = req.body.email;
    const name = req.body.name;
    const species = req.body.species;
    const dateOfBirth = req.body.dateOfBirth;
    const photo =  req.file ? req.file.filename : null;
    const sql1 = "SELECT id FROM users WHERE email = ?";
    const getOwner = await db.getAsync(sql1, id);

    const sql = "INSERT INTO pets (name,ownerid,species,dateofbirth,isarchived,photo) VALUES (?,?,?,?,?,?)";
  
    try {
      await db.runAsync(sql, [name,getOwner.id, species, dateOfBirth,0, photo]);
  
      res.json({ message: "Pet created successfully" });
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ error: "Failed to add a pet", detailedError: error.message });
    }
  });
  
  // Error handling middleware
  router.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal Server Error", detailedError: err.message });
  });

  module.exports = router;