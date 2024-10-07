import express from 'express';
const router = express.Router();
// Importing the required model
import Content from '../models/contentModel.js';

// Create Content (POST)
const createContent = async (req, res) => {
  try {
    const newContent = new Content({
      ourStory: {
        title: req.body.storyTitle,
        description: req.body.storyDescription,
        backgroundImage: req.body.storyBackgroundImage
      },
      responsibilities: req.body.responsibilities,
      vision: {
        title: req.body.visionTitle,
        content: req.body.visionContent,
        icon: req.body.visionIcon
      },
      mission: {
        title: req.body.missionTitle,
        content: req.body.missionContent,
        icon: req.body.missionIcon
      },
      founders: req.body.founders,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get Content (GET)
export const getContent = async (req, res) => {
  try {
    const content = await Content.findOne({});
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update Content (PUT)
export const updateContent = async (req, res) => {
  try {
    const updatedContent = await Content.findOneAndUpdate(
      {},
      {
        ourStory: {
          title: req.body.storyTitle,
          description: req.body.storyDescription,
          backgroundImage: req.body.storyBackgroundImage
        },
        responsibilities: req.body.responsibilities,
        vision: {
          title: req.body.visionTitle,
          content: req.body.visionContent,
          icon: req.body.visionIcon
        },
        mission: {
          title: req.body.missionTitle,
          content: req.body.missionContent,
          icon: req.body.missionIcon
        },
        founders: req.body.founders
      },
      { new: true }
    );
    res.status(200).json(updatedContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Content (DELETE)
export const deleteContent = async (req, res) => {
  try {
    const deletedContent = await Content.findOneAndDelete({});
    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json({ message: "Content deleted", deletedContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const contentControllers={
    createContent,
    getContent,
    updateContent,
    deleteContent
}

export default contentControllers;
