
import express from 'express';
const router = express.Router();
import heroControllers from'../controllers/heroControllers.js';



// GET website content
router.get('/getAll',heroControllers.getWebsiteContent);

// PUT to update the hero section
router.put('/hero', heroControllers.updateHeroSection);

router.post('/create', heroControllers.createWebsiteContent);

// PUT to update the about section
router.put('/about', heroControllers.updateAboutSection);

// POST to add a new program
router.post('/programs', heroControllers.addProgram);

// PUT to update an existing program
router.put('/programs/:id', heroControllers.updateProgram);

// DELETE to remove a program
router.delete('/programs/:id', heroControllers.deleteProgram);


// POST to add a new partner
router.post('/partners', heroControllers.addPartner);

// PUT to update an existing partner
router.put('/partners/:id', heroControllers.updatePartner);

// DELETE to remove a partner
router.delete('/partners/:id', heroControllers.deletePartner);

// PUT to update the footer (text and links)
router.put('/footer', heroControllers.updateFooter);

// POST to add a new footer link
router.post('/footer/links', heroControllers.addFooterLink);


export default router;




