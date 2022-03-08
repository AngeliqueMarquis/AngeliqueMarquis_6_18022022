/* models sauces import */
const Sauces = require('../models/Sauces')

/* file system import */
const fs = require('fs');

/* add sauces */
exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);

    /* creation of the sauce instance */
    const sauces = new Sauces({
        ...sauceObject, 
        /* create Image URL */
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    /* Backup to database */
    sauces.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

/* get a sauce */
exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({
      _id: req.params.id
    })
    .then((sauces) => {res.status(200).json(sauces)})
    .catch((error) => {res.status(404).json({error: error})});
  };
 
/* modify a sauce */  
exports.modifySauces = (req, res, next) => {
    if (req, res){
      /* look for the sauce */
      Sauces.findOne({_id: req.params.id})
        .then((sauces) => {
          /* search the image */
          const filename = sauces.imageUrl.split('/images/')[1];
          
          /* remove image from folder */
          fs.unlink(`images/${filename}`, (err) => {
            if(err) throw error;
          })
        })
        .catch (error => res.status(400).json({ error }));
    }else{
      console.log("False");
    }
    const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

/* delete a sauce */
exports.deleteSauces = (req, res, next) => {
    /* look for the sauce */
    Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      /* search the image */
      const filename = sauces.imageUrl.split('/images/')[1];

      /* remove image from folder */
      fs.unlink(`images/${filename}`, () => {
        /* delete from database */
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
 
/* get all the sauces  */
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
    .then((sauce) => {res.status(200).json(sauce)})
    .catch((error) => {res.status(400).json({error: error})});
  };

  exports.likeSauces = (req, res, next) => {
    switch (req.body.like) {
      /* user likes */
      case 1:
        Sauces.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
        )
          .then(() => res.status(200).json({ message: 'like !' }))
          .catch((error) => res.status(400).json({ error }));
        break;
      /* cancellation of likes/dislikes */
      case 0:
        Sauces.findOne({ _id: req.params.id })
          .then((sauces) => {
            /* user cancels his like */
            if (sauces.usersLiked.includes(req.body.userId)) {
              Sauces.updateOne(
                { _id: req.params.id },
                { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
              )
                .then(() =>
                  res.status(200).json({ message: 'like supprimé !' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            /* user cancels his dislike */
            if (sauces.usersDisliked.includes(req.body.userId)) {
              Sauces.updateOne(
                { _id: req.params.id },
                {
                  $pull: { usersDisliked: req.body.userId },
                  $inc: { dislikes: -1 },
                }
              )
                .then(() =>
                  res.status(200).json({ message: 'dislike supprimé !' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(404).json({ error }));
        break;
      /* user dislike */
      case -1:
        Sauces.updateOne(
          { _id: req.params.id },
          { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
        )
          .then(() => {
            res.status(200).json({ message: 'Dislike !' });
          })
          .catch((error) => res.status(400).json({ error }));
        break;
      default:
        console.log(error);
    }
  };