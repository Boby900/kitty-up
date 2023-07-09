const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/pets");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, postsController.getPet);

router.post("/createPet", upload.single("file"), postsController.createPet);

router.put("/likePet/:id", postsController.likePet);

router.delete("/deletePet/:id", postsController.deletePet);

module.exports = router;
