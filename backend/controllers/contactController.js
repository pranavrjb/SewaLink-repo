const Contact = require("../models/Contact");

// Submit a contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, category, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      category,
      message,
    });

    res.status(201).json({ message: "Message received successfully", contact });
  } catch (err) {
    console.error("Contact submission error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all contact messages (for admin)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
