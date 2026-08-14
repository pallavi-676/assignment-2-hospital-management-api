const Hospital = require("../models/Hospital");

// GET all hospitals
const getHospitals = async (req, res, next) => {
    try {
        const hospitals = await Hospital.find();

        res.status(200).json(hospitals);
    } catch (error) {
        next(error);
    }
};

// GET hospital by ID
const getHospitalById = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json(hospital);
    } catch (error) {
        next(error);
    }
};

// GET hospitals with available beds
const getAvailableHospitals = async (req, res, next) => {
    try {
        const hospitals = await Hospital.find({
            availableBeds: { $gt: 0 }
        });

        res.status(200).json(hospitals);
    } catch (error) {
        next(error);
    }
};

// POST hospital
const createHospital = async (req, res, next) => {
    try {
        const {
            name,
            city,
            totalBeds,
            availableBeds
        } = req.body;

        if (
            !name ||
            !city ||
            totalBeds === undefined ||
            availableBeds === undefined
        ) {
            return res.status(400).json({
                message: "All hospital fields are required"
            });
        }

        const hospital = await Hospital.create({
            name,
            city,
            totalBeds,
            availableBeds
        });

        res.status(201).json({
            message: "Hospital created successfully",
            hospital
        });
    } catch (error) {
        next(error);
    }
};

// PUT hospital
const updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            message: "Hospital updated successfully",
            hospital
        });
    } catch (error) {
        next(error);
    }
};

// DELETE hospital
const deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(
            req.params.id
        );

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            message: "Hospital deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getHospitals,
    getHospitalById,
    getAvailableHospitals,
    createHospital,
    updateHospital,
    deleteHospital
};