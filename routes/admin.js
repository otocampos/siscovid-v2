var express = require('express');
var router = express.Router();

const adminController = require('../controllers/adminController')
const validation = require('../middlewares/validation')
const encrypt = require('../middlewares/encrypt')
const auth = require('../middlewares/auth')


/* GET home page. */

router.get('/',auth.isAdmin, adminController.painelAdmin);
router.get('/logout',auth.logout);


router.get('/cadastro-usuarios',auth.isAdmin, adminController.cadastroUsuarioAdmin);
router.post('/cadastro-usuarios',auth.isAdmin,validation.validarCadastro,encrypt.encriptaCadastro, adminController.cadastrarUsuarios);


router.post('/registrar-tipo-usuario',auth.isAdmin, adminController.cadastrarTipoUsuario);

router.get('/login',auth.redirectPagina ,adminController.login);

router.post('/login',validation.validarLogin,auth.autenticar ,auth.identificarPerfil,auth.redirectPagina);


module.exports = router;