const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'mail.smtp2go.com',
  port: 2525,
  secure: false,
  auth: {
    user: 'fill in',
    pass: 'fill in',
  },
});



router.use(bodyParser.json());

router.get("/Pets/GetPet/:petId", async (req, res) => {
  
  const id = req.params.petId;
 
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


const checkToken = async (token) => {
 
  const sql = "SELECT count(*) as count FROM users WHERE token = ?";
  const result = await db.getAsync(sql, [token]);
  const count = result.count;
  return count>0;
};


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
  const photo = req.file ? req.file.filename : null;
  const token = req.body.token;
  const isValidToken = await checkToken(token);

  if (isValidToken) {  
  const sql = "UPDATE pets SET name = ?, species = ?, dateOfBirth = ?, photo = ? WHERE id = ?";
  try {
    await db.runAsync(sql, [name, species, dateOfBirth, photo, id]);

    res.json({ message: "Pet updated successfully" });
  } catch (error) {
    console.error("Error updating pet:", error);
    res.status(500).json({ error: "Failed to update pet", detailedError: error.message });
  }
  }
  else {
    res.status(500).json({ error: "No access"});
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
  const photo = req.file ? req.file.filename : null;
  const sql1 = "SELECT id FROM users WHERE email = ?";
  const getOwner = await db.getAsync(sql1, id);
  const token = req.body.token;

  const isValidToken = await checkToken(token);

  if (isValidToken) {  
  const sql = "INSERT INTO pets (name,ownerid,species,dateofbirth,isarchived,photo) VALUES (?,?,?,?,?,?)";

  try {
    await db.runAsync(sql, [name, getOwner.id, species, dateOfBirth, 0, photo]);

    res.json({ message: "Pet created successfully" });
  } catch (error) {
    console.error("Error creating pet:", error);
    res.status(500).json({ error: "Failed to add a pet", detailedError: error.message });
  }}
  else {
    res.status(500).json({ error: "No access"});
  }


});

// Error handling middleware
router.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ error: "Internal Server Error", detailedError: err.message });
});


router.post("/Pets/MakeAppointment", async (req, res) => {
  const petid = req.body.petId;
  const doctorid = req.body.doctorId;
  const date = req.body.date;
  const starttime = req.body.datetimeStart;
  const endtime = req.body.datetimePlusOneHour;
  const ownersemail = req.body.ownersemail;

  const sql1 = "SELECT ownerid FROM pets WHERE id = ?";

  const getOwner = await db.getAsync(sql1, petid);


  const sql = "INSERT INTO appointments (doctor_id,owner_id,pet_id,startdate,enddate) VALUES (?,?,?,?,?)";


  try {
    await db.runAsync(sql, [doctorid, getOwner.ownerid, petid, starttime, endtime]);



    const mailOptions = {
      from: 'fill the correct email here',
      to: ownersemail,
      subject: 'Your appointment details',
      text: 'Your pet has an appointment on ' + starttime,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: "Appointment created" });
  } catch (error) {
    console.error("Error creating an appointment:", error);
    res.status(500).json({ error: "Failed to create an appointment", detailedError: error.message });
  }
});

router.get("/Pets/GetAppointments/:email", async (req, res) => {

  const email = req.params.email;

  const sql = "SELECT * FROM appointments WHERE owner_id in (SELECT id from users where email = ?)";
  const getAppts = await db.allAsync(sql, email);

  if (getAppts === undefined) {

    res.json({
      message: "No appointments",
    });
  } else {
    res.json({
      appoints: getAppts,
    });
  }

});


router.get("/Pets/GetAppointmentsForADoctor/:id", async (req, res) => {

  const id = req.params.id;

  const sql = "SELECT * FROM appointments WHERE doctor_id  = ?";
  const getAppts = await db.allAsync(sql, id);

  if (getAppts === undefined) {

    res.json({
      message: "No appointments",
    });
  } else {
    res.json({
      appoints: getAppts,
    });
  }

});


router.get("/Pets/GetAppointmentsForAPet/:petId", async (req, res) => {

  const petId = req.params.petId;

  const sql = "SELECT * FROM appointments WHERE pet_id  = ?";
  const getAppts = await db.allAsync(sql, petId);

  if (getAppts === undefined) {

    res.json({
      message: "No appointments",
    });
  } else {
    res.json({
      appoints: getAppts,
    });
  }

});

router.get("/Pets/GetHealthRecordsForAPet/:petId", async (req, res) => {

  const petId = req.params.petId;

  const sql = "SELECT * FROM health_records WHERE pet_id  = ?";
  const getHRs = await db.allAsync(sql, petId);

  if (getHRs === undefined) {

    res.json({
      message: "No appointments",
    });
  } else {
    res.json({
      HRs: getHRs,
    });
  }

});



router.post("/Pets/CreateRecord", async (req, res) => {
  const doctorId = req.body.doctorId;
  const petId = req.body.petId;
  const text = req.body.record;
  const date = req.body.date;

  const sql = "INSERT INTO health_records (doctor_id,pet_id,date,record) VALUES (?,?,?,?)";

  try {
    await db.runAsync(sql, [doctorId, petId, date, text]);

    res.json({ message: "Health record created successfully" });
  } catch (error) {
    console.error("Error creating health record:", error);
    res.status(500).json({ error: "Failed to create health record", detailedError: error.message });
  }
});


module.exports = router;