/* bcrypt import */
const bcrypt = require('bcrypt');
/* jsonwebtoken import */
const jwt = require('jsonwebtoken')

/* models users import */
const users = require('../models/Users')

/* user registration */
exports.signup = (req, res, next) => {
    /* password hash */
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new users({
            email: req.body.email,
            password: hash
        }); 
        /* record in database */
        user.save()
            .then(() => res.status(201).json ({message: 'Utilisateur crée !'}))
            .catch(error => res.status(400).json({error}))
    })
    .catch(error => res.status(500).json({error}));
};

/* user login */
exports.login = (req, res, next) => {
    /* search user in database */
    users.findOne({email : req.body.email})
        .then(user => {
            /* user not found */
            if (!user) {
                return res.status(401).json({error :'Utilisateur non trouvé !'})
            }
            /* user found/ compare password with database */
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    /* incorrect password */
                    if (!valid) {
                        return res.status(401).json({error :'Mot de passe incorrect !'})    
                    }
                    /* correct password / Token creation */
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.KEY_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({error}))
        })
        .catch(error => res.status(500).json({error}));

};