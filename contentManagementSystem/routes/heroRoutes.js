
import express from 'express';
const router = express.Router();
import heroControllers from'../controllers/heroControllers.js';


// create websiteContent
router.post('/create', heroControllers.createWebsiteContent);
// GET website content
router.get('/getAll',heroControllers.getWebsiteContent);
// PUT to update the hero section
router.put('/update-hero', heroControllers.updateHeroSection);


// PUT to update the about section
router.put('/update-about', heroControllers.updateAboutSection);


// POST to add a new program
router.post('/add-programs', heroControllers.addProgram);
// PUT to update an existing program
router.put('/update-programs', heroControllers.updateProgram);
// DELETE to remove a program
router.delete('/delete-program/:id', heroControllers.deleteProgram);


// POST to add a new partner
router.post('/addPattern', heroControllers.addPartner);
// PUT to update an existing partner
router.put('/update-partners', heroControllers.updatePartner);
// DELETE to remove a partner
router.delete('/delete/:id', heroControllers.deletePartner);

export default router;




