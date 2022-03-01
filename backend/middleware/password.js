const passwordValid = require('password-validator');

const passwordSchema = new passwordValid();

passwordSchema
.is().min(6)
.is().max(20)
.has().digits(1)
.has().not().spaces()

module.exports = (req, res, next) => {
    if(passwordSchema.validate(req.body.password)){
        next();
    } else {
        return res.status(400).json({ error : "Le mot de passe est trop simple !" + passwordSchema.validate('req.body.password', {list: true})})
    }
} 