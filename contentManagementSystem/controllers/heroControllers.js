
import express from 'express';
const router = express.Router();
// Importing the required model
import WebsiteContent from '../models/heromodel.js';


// Adding Programs (POST)
const addProgram = async (req, res) => {
    try {
      const newProgram = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        link: req.body.link
      };
  
      // Use $push to add the new program to the 'programs' array
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $push: { programs: newProgram } },
        { new: true, select: 'programs' } // Return only 'programs' field
      );
  
      res.status(201).json({ message: "Program added", programs: updatedContent.programs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Updating Programs Section
const updateProgram= async (req, res) => {
    try {
      const updatedPrograms = req.body.programs; // Expecting an array of programs
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { programs: updatedPrograms },
        { new: true }
      );
      res.status(200).json(updatedContent.programs); // Return only the updated programs
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

 // Delete Program (DELETE)
const deleteProgram = async (req, res) => {
    try {
      const programId = req.params.id; // assuming the program's _id is passed in the request params
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $pull: { programs: { _id: programId } } },
        { new: true, select: 'programs' } // Return only the 'programs' field
      );
  
      // Check if the program was found and deleted
      if (!updatedContent) {
        return res.status(404).json({ message: "Program not found" });
      }
  
      res.status(200).json({ message: "Program deleted", programs: updatedContent.programs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

//   Adding a Partner (POST)
const addPartner = async (req, res) => {
    try {
      const newPartner = {
        name: req.body.name,
        logo: req.body.logo,
        link: req.body.link
      };
  
      // Add the new partner to the 'partners' array using $push
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $push: { partners: newPartner } },
        { new: true, upsert: true, select: 'partners' } // Return only 'partners' field
      );
  
      res.status(201).json(updatedContent.partners); // Return only the updated partners
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
// Updating Partners Section
const updatePartner = async (req, res) => {
    try {
      const updatedPartners = req.body.partners; // Expecting an array of partners
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { partners: updatedPartners },
        { new: true }
      );
      res.status(200).json(updatedContent.partners); // Return only the updated partners
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  // Deleting a Partner (DELETE)
const deletePartner = async (req, res) => {
    try {
      const partnerId = req.params.id;
  
      // Use $pull to remove the partner with the matching _id from the 'partners' array
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $pull: { partners: { _id: partnerId } } },
        { new: true, select: 'partners' } // Return only 'partners' field
      );
  
      // Check if the partner was successfully deleted
      if (!updatedContent) {
        return res.status(404).json({ message: "Partner not found" });
      }
  
      res.status(200).json({ message: "Partner deleted", partners: updatedContent.partners });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

  // POST new website content
   const createWebsiteContent = async (req, res) => {
    console.log("Request Body:", req.body); 
    const newContent = new WebsiteContent(req.body);
    try {
      const savedContent = await newContent.save();
      res.status(201).json(savedContent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  };

  // Fetching all website content from MongoDB
const getWebsiteContent = async (req, res) => {
    try {
      // Fetching all content from MongoDB
      const content = await WebsiteContent.findOne({}); // This fetches a single document with website content
      
      if (!content) {
        return res.status(404).json({ message: 'Website content not found' });
      }
  
      res.json(content);  // Send back the website content
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
   const updateHeroSection = async (req, res) => {
    try {
      const updatedHeroSection = {
        title: req.body.title,
        subtitle: req.body.subtitle,
        buttonText: req.body.buttonText,
        buttonLink: req.body.buttonLink,
        backgroundImage: req.body.backgroundImage
      };
  
      // Update the hero section inside the WebsiteContent
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {}, // Find the first document
        { hero: updatedHeroSection }, // Update only the hero section
        { new: true, projection: { hero: 1 } } // Return only the hero section
      );
  
      if (updatedContent) {
        res.status(200).json(updatedContent.hero); // Return the updated hero section only
      } else {
        res.status(404).json({ message: 'No content found to update' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
// Updating About Section (including Vision and Mission)
const updateAboutSection = async (req, res) => {
    try {
      const updatedAboutSection = {
        vision: {
          title: req.body.vision.title,
          description: req.body.vision.description,
          icon: req.body.vision.icon, // You may include the icon field as well if needed
        },
        mission: {
          title: req.body.mission.title,
          description: req.body.mission.description,
          icon: req.body.mission.icon,
        }
      };
  
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { about: updatedAboutSection },
        { new: true, projection: { 'about': 1 } }
      );
  
      if (!updatedContent) {
        return res.status(404).json({ error: "No content found to update" });
      }
  
      res.status(200).json(updatedContent.about); // Return only the about section (vision and mission)
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
const heroControllers={ 
createWebsiteContent,
  getWebsiteContent,
  updateHeroSection,
  updateAboutSection,
  addProgram,
  updateProgram,
  deleteProgram,
  addPartner,
  updatePartner,
  deletePartner,
}
export default heroControllers;



  
