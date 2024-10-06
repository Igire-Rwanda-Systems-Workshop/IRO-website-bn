import express from 'express';
const router = express.Router();
// Importing the required model
import Content from '../models/contentModel.js';

// Create new content
 const createContent = async (req, res) => {
  try {
    const content = new Content(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all content
const getContent = async (req, res) => {
  try {
    const content = await Content.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update content by ID
 const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContent = await Content.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete content by ID
 const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    await Content.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const contentControllers={
    createContent,
    getContent,
    updateContent,
    deleteContent
}

export default contentControllers;
