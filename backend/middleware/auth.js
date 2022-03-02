/* jsonwebtoken import */
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        /* Retrieve the token from the Authorization header */
        const token = req.headers.authorization.split(' ')[1];

        /* decode the token stored in the .env file */
        const decodedToken = jwt.verify(token, process.env.KEY_SECRET);

        /* Retrieve user ID from token */
        const userId = decodedToken.userId;

        /* check that the user Id of the request matches that of the token */
        req.auth = {userId};
        if(req.body.userId && req.body.userId !== userId) {
            throw 'User ID non valable!';
        } else { 
            next ();
        }
    } catch (error) {
      res.status(401).json({error : error | 'Requête non authentifiée !' })  
    }
};