const User = require("../models/User");
const Service = require("../models/Service");

exports.getProviderProfile = async (req, res) => {
  try {
    const providerId = req.params.id;

    const provider = await User.findOne({
      _id: providerId,
      role: "provider",
    }).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const services = await Service.find({ provider: providerId });

    res.status(200).json({
      provider,
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
