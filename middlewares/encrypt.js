const bcrypt = require('bcrypt');
const path = require('path')
const {
    check,
    validationResult,
    body
} = require('express-validator')

encriptaCadastro = (req, res, next) => {
  
    
     let listaDeErros =validationResult(req)
    if (listaDeErros.isEmpty()) {
         req.body.passwordSystemUser = bcrypt.hashSync(
            req.body.passwordSystemUser
             , 10);
        
    }  
next();
}

module.exports = { encriptaCadastro }