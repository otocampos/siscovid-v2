var express = require('express');
var router = express.Router();
const homeController = require('../controllers/homeController')
const internacaoController = require('../controllers/internacaoController')
const auth = require('../middlewares/auth')
const setoresController = require ('../controllers/setoresController')
/* GET home page. */




router.get('/',auth.redirectPagina , homeController.login);
router.get('/painel-hospital',auth.isOperador, homeController.painelHospital)
router.get('/cadastro-paciente',auth.isOperador ,homeController.cadastroPaciente)


router.post('/cadastrar-paciente',auth.isOperador ,homeController.cadastrarPaciente)

router.get('/pacientes', auth.isOperador, homeController.listaPaciente)
router.post('/pacientes/:search',auth.isOperador, homeController.buscaPaciente)

router.get('/setores', auth.isOperador, setoresController.listaSetoresAtivos)
router.get('/setores/:idLocal/pacientes',auth.isOperador,setoresController.listaInternacaoBySetor)



router.get('/paciente/:id',auth.isOperador, homeController.showPacienteId)


router.get('/cadastro-parente/:idPaciente',auth.isOperador,homeController.cadastroParente)
router.post('/cadastrar-parente/:idPaciente',auth.isOperador,homeController.cadastrarParente)


router.get('/cadastrar-laudo/:idPaciente',auth.isOperador,homeController.cadastroLaudo)
router.post('/cadastrar-laudo/:idPaciente',auth.isOperador,internacaoController.laudoCovid)

router.post('/cadastro-laudo/sucesso',auth.isOperador,homeController.telaSucesso)

router.get('/paciente/laudo/:laudoId',auth.isOperador,homeController.showLaudoById)

router.get('/paciente/laudo/email/enviar/:id',auth.isOperador,homeController.enviarEmailLaudoById)

router.post('/cadastrar-laudo/:idPaciente/alta', auth.isOperador,internacaoController.altaPaciente)

router.post('/cadastrar-laudo/:idPaciente/obito', auth.isOperador, internacaoController.obitoPaciente)
router.post('/cadastrar-laudo/:idPaciente/coleta-swab',auth.isOperador, internacaoController.laudoColetaSwab)
router.post('/cadastrar-laudo/:idPaciente/resultado-coleta-swab',auth.isOperador, internacaoController.laudoResultadoColetaSwab)
router.post('/cadastrar-laudo/:idPaciente/respiracao',auth.isOperador, internacaoController.laudoRespiracao)


router.post('/cadastrar-laudo/:idPaciente/internar', auth.isOperador, homeController.internarPaciente)


router.get('/paciente/:id/internar',auth.isOperador,internacaoController.InternacaoPaciente)
router.post('/paciente/:id/internar',auth.isOperador,internacaoController.InternarPaciente)

router.get('/paciente/:id/internacao',auth.isOperador,internacaoController.singleInternacao)

router.post('/paciente/:id/internacao/transferir',auth.isOperador,internacaoController.transferirDeLeito)



router.get('/estatisticas', auth.isOperador, internacaoController.estatisticas)

router.post('/estatisticas/busca',auth.isOperador,internacaoController.buscaEstatisticas)


//router.get('/login',sessionLogin.paginaPrivada,homeController.login)

//router.post('/login',validation.validarLogin,homeController.logar)

//router.get('/login/admin',homeController.login)






module.exports = router;
