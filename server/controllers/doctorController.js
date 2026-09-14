const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.getDoctors = async (req, res) => {
  try {

    const {
      specialization,
      search,
    } = req.query;


    const filter = {
      role: "doctor",
    };

    if (specialization) {

      filter.specialization = {
        $regex: specialization,
        $options: "i",
      };

    }
    if (search) {

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },

        {
          hospital: {
            $regex: search,
            $options: "i",
          },
        },

        {
          specialization: {
            $regex: search,
            $options: "i",
          },
        },
      ];

    }


    const doctors = await User.find(filter)
      .select(
        "-password -phone -dateOfBirth"
      )
      .sort({
        name: 1,
      });


    res.json({
      count: doctors.length,
      doctors,
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch doctors",
    });

  }
};

exports.getMyPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.user._id,
    })
      .populate("patient", "name email phone gender dateOfBirth")
      .sort({ createdAt: -1 });

    const patientMap = new Map();

    appointments.forEach((appointment) => {
      if (!appointment.patient) return;

      const id = appointment.patient._id.toString();

      if (!patientMap.has(id)) {
        patientMap.set(id, {
          patient: appointment.patient,
          totalVisits: 0,
          completedVisits: 0,
          lastAppointment: null,
          upcomingAppointment: null,
        });
      }

      const entry = patientMap.get(id);
      entry.totalVisits += 1;

      if (appointment.status === "completed") {
        entry.completedVisits += 1;
      }

      if (
        !entry.lastAppointment ||
        new Date(appointment.date) > new Date(entry.lastAppointment.date)
      ) {
        entry.lastAppointment = appointment;
      }

      if (
        ["pending", "confirmed"].includes(appointment.status) &&
        (!entry.upcomingAppointment ||
          new Date(appointment.date) < new Date(entry.upcomingAppointment.date))
      ) {
        entry.upcomingAppointment = appointment;
      }
    });

    const patients = Array.from(patientMap.values());

    res.json({
      count: patients.length,
      patients,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch patients",
    });
  }
};

exports.getMyStats = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const appointments = await Appointment.find({ doctor: doctorId });

    const totalAppointments = appointments.length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const confirmed = appointments.filter((a) => a.status === "confirmed").length;
    const completed = appointments.filter((a) => a.status === "completed").length;

    const uniquePatients = new Set(
      appointments.map((a) => a.patient.toString())
    ).size;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysAppointments = appointments
      .filter((a) => {
        const d = new Date(a.date);
        return (
          !Number.isNaN(d.getTime()) &&
          d.toDateString() === today.toDateString() &&
          ["pending", "confirmed"].includes(a.status)
        );
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    const upcoming = appointments
      .filter((a) => {
        const d = new Date(a.date);
        return (
          !Number.isNaN(d.getTime()) &&
          d >= today &&
          ["pending", "confirmed"].includes(a.status)
        );
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);

    const upcomingPopulated = await Appointment.populate(upcoming, {
      path: "patient",
      select: "name email phone",
    });

    const todaysPopulated = await Appointment.populate(todaysAppointments, {
      path: "patient",
      select: "name email phone",
    });

    res.json({
      totalAppointments,
      pending,
      confirmed,
      completed,
      uniquePatients,
      todaysAppointments: todaysPopulated,
      upcomingAppointments: upcomingPopulated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch doctor stats",
    });
  }
};

exports.getDoctor = async (req, res) => {

  try {

    const doctor = await User.findOne({
      _id: req.params.id,
      role: "doctor",
    }).select("-password");


    if (!doctor) {

      return res.status(404).json({
        message: "Doctor not found",
      });

    }


    res.json(doctor);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch doctor",
    });

  }
};