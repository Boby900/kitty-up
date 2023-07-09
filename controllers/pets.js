const cloudinary = require("../middleware/cloudinary");
const Pet = require("../models/Pet");

module.exports = {
  getHome: async (req, res) => {
    try {
      const pets = await Pet.find({ user: req.user.id });
      res.render("home.ejs", { pets: pets, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPet: async (req, res) => {
    try {
      const pets = await Pet.findById(req.params.id);
      res.render("pet.ejs", { pets: pets, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  listedPets: async (req, res) => {
    try {
      const pets = await Pet.find().sort({ createdAt: "desc" }).lean();
      res.render("listedPet.ejs", { pets: pets, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  listAPet: async (req, res) => {
    try {
      const pets = await Pet.find().sort({ createdAt: "desc" }).lean();
      res.render("listAPet.ejs", { pets: pets, user: req.user  });
    } catch (err) {
      console.log(err);
    }
  },
  createPet: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Pet.create({
        name: req.body.name,
        caption:req.body.caption,
        image: result.secure_url,
        details: req.body.details,
        cloudinaryId: result.public_id,
        user: req.user.id,
      });
      console.log("Pet has been added!");
      
      res.redirect("/home");
    } catch (err) {
      console.log(err);
    }
  },
  likePet: async (req, res) => {
    try {
      await Pet.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/home/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePet: async (req, res) => {
    try {
      // Find post by id
      let pet = await Pet.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(pet.cloudinaryId);
      // Delete post from db
      await Pet.remove({ _id: req.params.id });
      console.log("Deleted Pet");
      res.redirect("/home");
    } catch (err) {
      res.redirect("/home");
    }
  },
};
