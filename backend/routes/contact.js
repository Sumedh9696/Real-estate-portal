const express = require("express");
const { readCollection, writeCollection } = require("../utils/db");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// POST /api/contact - send a message to a property owner
router.post("/", (req, res) => {
  const { propertyId, propertyTitle, name, email, phone, message } = req.body;

  if (!propertyId || !name || !email || !message) {
    return res.status(400).json({
      message: "propertyId, name, email and message are required.",
    });
  }

  const messages = readCollection("messages");

  const newMessage = {
    id: Date.now().toString(),
    propertyId,
    propertyTitle: propertyTitle || "",
    name,
    email,
    phone: phone || "",
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  messages.push(newMessage);
  writeCollection("messages", messages);

  res.status(201).json({
    message: "Your message has been sent to the owner successfully.",
    data: newMessage,
  });
});

// GET /api/contact - list all messages (admin only)
router.get("/", requireAdmin, (req, res) => {
  const messages = readCollection("messages");
  const sorted = [...messages].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  res.json({ count: sorted.length, messages: sorted });
});

// PATCH /api/contact/:id/read - mark a message as read (admin only)
router.patch("/:id/read", requireAdmin, (req, res) => {
  const messages = readCollection("messages");
  const index = messages.findIndex((m) => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Message not found." });
  }

  messages[index].read = true;
  writeCollection("messages", messages);
  res.json(messages[index]);
});

// DELETE /api/contact/:id - delete a message (admin only)
router.delete("/:id", requireAdmin, (req, res) => {
  const messages = readCollection("messages");
  const index = messages.findIndex((m) => m.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Message not found." });
  }

  const removed = messages.splice(index, 1);
  writeCollection("messages", messages);
  res.json({ message: "Message deleted.", data: removed[0] });
});

module.exports = router;
