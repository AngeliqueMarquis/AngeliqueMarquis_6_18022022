const Sauces = require('../models/sauces')
const fs = require('fs');

exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauces = new Sauces({
        ...sauceObject, 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauces.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.getOneSauces = (req, res, next) => {
    Sauces.findOne({
      _id: req.params.id
    }).then(
      (sauces) => {
        res.status(200).json(sauces);
      }
    ).catch(
      (error) => {
        res.status(404).json({
          error: error
        });
      }
    );
  };
  
exports.modifySauces = (req, res, next) => {
    const saucesObject = req.file ?
    {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({ _id: req.params.id }, { ...saucesObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};
  
exports.deleteSauces = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      const filename = sauces.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};
  
exports.getAllSauces = (req, res, next) => {
    Sauces.find().then(
      (sauce) => {
        res.status(200).json(sauce);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

  exports.likeSauces = (req, res, next) => {
    // LIKE
    switch (req.body.like) {
      case 1:
        Sauces.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
        )
          .then(() => res.status(200).json({ message: 'like !' }))
          .catch((error) => res.status(400).json({ error }));
        break;
      // Annulation du like / dislike
      case 0:
        Sauces.findOne({ _id: req.params.id })
          .then((sauces) => {
            if (sauces.usersLiked.includes(req.body.userId)) {
              Sauces.updateOne(
                { _id: req.params.id },
                { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
              )
                .then(() =>
                  res.status(200).json({ message: 'like / dislike supprimé !' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
            if (sauces.usersDisliked.includes(req.body.userId)) {
              Sauces.updateOne(
                { _id: req.params.id },
                {
                  $pull: { usersDisliked: req.body.userId },
                  $inc: { dislikes: -1 },
                }
              )
                .then(() =>
                  res.status(200).json({ message: 'like / dislike supprimé !' })
                )
                .catch((error) => res.status(400).json({ error }));
            }
          })
          .catch((error) => res.status(404).json({ error }));
        break;
      // DISLIKE
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