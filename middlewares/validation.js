const path = require('path')
const {
    check,
    validationResult,
    body
} = require('express-validator')
const nome = "nomeSystemUser";
const email = "emailSystemUser";
const rg = "rgSystemUser";
const cpf = "cpfSystemUser";
const password = "passwordSystemUser";
const tipoUsuario = "selectTipoUsuario";



const validarCadastro = [
  
    check(nome)
        .exists()
        .isLength({min: 1 , max: 50}).withMessage('tamanho maximo 50 characters'),
         
    check(email)
        .exists()
    .isEmail().withMessage('utilize um formato de e-mail'),
    check(rg)
        .exists()
        .isNumeric().withMessage('utilize apenas números no rg'),    
    check(cpf).isNumeric()
        .isLength({ min: 11, max: 11 }).withMessage('formato de CPF incorreto')
        .notEmpty(),
    
        check(password, "Password é obrigatório")
        .notEmpty()
        .isLength({
          min: 6
        })
        .withMessage("Password precisa de no minimo 6 characters")
        .isLength({
          max: 8
        })
    .withMessage("Password pode conter no máximo 8 characters"),
        
  check(tipoUsuario).isNumeric()
    .isLength({ min: 1, max:3 })

] 

const validarLogin = [
  check('cpflogin').isNumeric()
  .isLength({ min: 11, max: 11 }).withMessage('formato de CPF incorreto')
  .notEmpty(),
  check(password, "Password é obrigatório")
        .notEmpty()
        .isLength({
          min: 6
        })
        .withMessage("Password precisa de no minimo 6 characters")
        .isLength({
          max: 8
        })
    .withMessage("Password pode conter no máximo 8 characters"),
]



module.exports = { validarCadastro,validarLogin }

