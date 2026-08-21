const express = require("express");

const {
    getHospitals,
    getHospitalById,
    getAvailableHospitals,
    createHospital,
    updateHospital,
    deleteHospital
} = require("../controllers/hospitalController");

const router = express.Router();

router.get("/", getHospitals);

router.get("/available", getAvailableHospitals);

router.get("/:id", getHospitalById);

router.post("/", createHospital);

router.put("/:id", updateHospital);

router.delete("/:id", deleteHospital);

module.exports = router;