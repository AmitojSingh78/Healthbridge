const userModel = require("../models/User");
const appointmentModel = require("../models/Appointment");
const procedureProtocolModel = require("../models/ProcedureProtocol");
const OTModel = require("../models/OperationTheatre");
const bedModel = require("../models/Bed");
const labOrderModel = require("../models/LabOrder");
const Insurance = require("../models/Insurance");
const getPatient = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name query parameter is required" });
    }
    const patient = await userModel.findOne({ name, role: "patient" });
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    return res.status(200).json({ success: true, patient });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching patient data",
        error: err.message,
      });
  }
};
const checkDoctorAvailability = async (req, res) => {
  try {
    const { doctorName, date } = req.query;

    if (!doctorName || !date) {
      return res.status(400).json({
        success: false,
        message: "Doctor name and date are required",
      });
    }

    const doctor = await userModel.findOne({
      name: doctorName,
      role: "doctor",
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    const appointments = await appointmentModel.find({
      doctor: doctor._id,
      date,
      status: {
        $in: ["pending", "confirmed"],
      },
    });

    return res.status(200).json({
      success: true,

      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
      },

      date,

      available: appointments.length === 0,

      existingAppointments: appointments,
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error checking doctor availability",
      error: err.message,
    });
  }
};

const procedure = async (req, res) => {
  try {
    const { code } = req.params;
    const procedure = await procedureProtocolModel.findOne({ code });
    if (!procedure) {
      return res.status(404).json({ message: "Procedure not found" });
    }
    return res.status(200).json({
      success: true,
      procedure,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error performing procedure",
        error: err.message,
      });
  }
};
const getBedStatus = async (req, res) => {
  try {
    const { ward } = req.query;
    if (!ward) {
      return res
        .status(400)
        .json({ success: false, message: "Ward query parameter is required" });
    }
    const beds = await bedModel.find({ ward, status: "available" });
    return res.status(200).json({ success: true, beds: beds });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching bed status",
        error: err.message,
      });
  }
};
const otAvailability = async (req, res) => {
  try {
    const { procedure, date } = req.query;
    if (!procedure || !date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Procedure and date query parameters are required",
        });
    }
    const ots = await OTModel.find({ supportedProcedures: procedure });
    if (!ots || ots.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No OT found for the given procedure",
        });
    }
    const availableOTs = [];
    for (const ot of ots) {
      const availableSlots = ot.slots.filter(
        (slot) => slot.date === date && slot.status === "available",
      );
      if (availableSlots.length > 0) {
        availableOTs.push({
          otId: ot._id,
          OTName: ot.OTName,
          availableSlots,
        });
      }
    }
    return res.status(200).json({
      success: true,
      count: availableOTs.length,
      operationTheatres: availableOTs,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error checking OT availability",
        error: err.message,
      });
  }
};
const patientLabOrders = async (req, res) => {
  try {
    const { patientId } = req.params;
    const labOrders = await labOrderModel
      .find({ patient: patientId })
      .populate("requestedBy", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, labOrders });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching lab orders",
        error: err.message,
      });
  }
};
const insuranceClaimStatus = async (req, res) => {
  try {
    const { patientId } = req.params;
    const patient = await userModel.findById(patientId);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    const insurance = await Insurance.findOne({ patient: patientId });
    if (!insurance) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Insurance details not found for the patient",
        });
    }
    return res.status(200).json({ success: true, insurance });
  } catch (err) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error checking insurance claim status",
        error: err.message,
      });
  }
};
module.exports = {
  getPatient,
  checkDoctorAvailability,
  procedure,
  getBedStatus,
  otAvailability,
  patientLabOrders,
  insuranceClaimStatus,
};
