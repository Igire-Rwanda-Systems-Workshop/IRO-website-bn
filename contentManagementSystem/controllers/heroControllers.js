
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
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $push: { programs: newProgram } },
        { new: true }
      );
      res.status(201).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
//  update program

 const updateProgram = async (req, res) => {
    try {
      const programId = req.params.id; // assuming you pass the program's _id in the request params
      const updatedProgram = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        link: req.body.link
      };
  
      const updatedContent = await WebsiteContent.updateOne(
        { "programs._id": programId },
        { $set: { "programs.$": updatedProgram } },  // update the matching program
        { new: true }
      );
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // delete program

  const deleteProgram = async (req, res) => {
  try {
    const programId = req.params.id;  // assuming the program's _id is passed in the request params
    const updatedContent = await WebsiteContent.findOneAndUpdate(
      {},
      { $pull: { programs: { _id: programId } } },
      { new: true }
    );
    res.status(200).json({ message: "Program deleted", updatedContent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// update footer
const updateFooter = async (req, res) => {
    try {
      const updatedFooter = {
        text: req.body.text,
        links: req.body.links  // Assuming an array of links (label and url)
      };
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { footer: updatedFooter },
        { new: true }
      );
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

//   add footer links

const addFooterLink = async (req, res) => {
    try {
      const newLink = {
        label: req.body.label,
        url: req.body.url
      };
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $push: { "footer.links": newLink } },
        { new: true }
      );
      res.status(201).json(updatedContent);
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
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $push: { partners: newPartner } },
        { new: true }
      );
      res.status(201).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

//   Updating a Partner (PUT)

const updatePartner = async (req, res) => {
    try {
      const partnerId = req.params.id;
      const updatedPartner = {
        name: req.body.name,
        logo: req.body.logo,
        link: req.body.link
      };
      const updatedContent = await WebsiteContent.updateOne(
        { "partners._id": partnerId },
        { $set: { "partners.$": updatedPartner } },
        { new: true }
      );
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  //   Deleting a Partner (DELETE)
  const deletePartner = async (req, res) => {
    try {
      const partnerId = req.params.id;
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { $pull: { partners: { _id: partnerId } } },
        { new: true }
      );
      res.status(200).json({ message: "Partner deleted", updatedContent });
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
  
  // Updating Hero Section
  const updateHeroSection = async (req, res) => {
    try {
      const updatedHeroSection = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        link: req.body.link
      };
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { heroSection: updatedHeroSection },
        { new: true }
      );
      res.status(200).json(updatedContent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Updating About Section
  const updateAboutSection = async (req, res) => {
    try {
      const updatedAboutSection = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
      };
      const updatedContent = await WebsiteContent.findOneAndUpdate(
        {},
        { aboutSection: updatedAboutSection },
        { new: true }
      );
      res.status(200).json(updatedContent);
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
  updateFooter,
  addFooterLink
}
export default heroControllers;



  
