const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const moment = require('moment-timezone');
var generatorPS = require('generate-password');
const ejs = require("ejs")
const Email = require('../config/email')
const utils = require('../utils/utils')

const {
  Situacao,
  Paciente,
  Parentesco,
  EstadoGeral,
  Laudo,
  Parente,
  ParentePaciente,
  Leito,
  Local,
  Internacao,
  TiposDeResultadoExame,
  Respiracao
} = require('../models')
const {
  check,
  validationResult,
  body
} = require('express-validator')

let fileNewsLetter

const homeController = {

    login: (req, res) => {
      res.render('login', {
        title: 'Login',
        erro: ''
      })
    },
    painelHospital: (req, res) => {
      res.render('painel-hospital', {
        title: 'Painel-Hospital',
        userInfo: req.session.usuarioInfo
      })
    },
    cadastroPaciente: async (req, res) => {
      const allSituacaoCadastal = await Situacao.findAll();
      const allLeitos = await Local.findAll({
        include: [{
        where:{ocupado:0,status:1},
        attributes: ['id', 'numero'],
        model: Leito,
        require: true,
        raw: true,
        as: 'leito',
      }]
      });      
      res.render('cadastro-paciente', {
        title: 'Cadastro Paciente',
        userInfo: req.session.usuarioInfo,
        situacoesCadastro: allSituacaoCadastal,
        leitosVagos:allLeitos,
        usuarioId: req.session.usuarioId
      })
      console.log(allLeitos)
    },

    cadastrarPaciente: async (req, res) => {

      let {
        nomePaciente,
        emailPaciente,
        rgPaciente,
        cpfPaciente,
        dtNascimentoPaciente,
        selectSituacaoCadastral,
        telPaciente,
        dtInternacao,
        endPaciente,
        radioGenero,
        checkFuspom
      } = req.body

      let listadeErros = validationResult(req);


      if (listadeErros.isEmpty()) {

        dtNascimentoPaciente = moment(dtNascimentoPaciente).format("YYYY/MM/DD");
        dtInternacao = moment(dtInternacao).format("YYYY/MM/DD")
        const [paciente, created] = await Paciente.findOrCreate({
            where: {
              [Sequelize.Op.or]: [{
                cpf: cpfPaciente
              }, {
                rg: rgPaciente
              }]
            },

            defaults: {
              nome: nomePaciente,
              email: emailPaciente,
              rg: rgPaciente,
              cpf: cpfPaciente,
              dt_nascimento: dtNascimentoPaciente,
              situacao_cadastral_id: selectSituacaoCadastral,
              telefone: telPaciente,
              endereco: endPaciente,
              internado: 0,
              tipo_usuario_id: 16,
              admin_id: req.session.usuarioId,
              obito: 0,
              genero: radioGenero,
              fuspom:checkFuspom
            }
          })

          .then(createdRecords => {
            const [object, created] = createdRecords;
            if (created) {

              res.status(200).render('sucesso', {
                title: 'cadastro de usuarios',
                nome: object.nome,
                email: object.email,
                cpf: object.cpf,
                rg: object.rg,
                userInfo: req.session.usuarioInfo
              })
            } else {
              res.render('erro', {
                title: 'erro',
                msg: 'Usuário já cadastrado no sistema',
                userInfo: req.session.usuarioInfo
              })
            }
          }).catch(Sequelize.ValidationError, error => {
            console.log(error)
            //res.status(400).json(error);

          })





      }





  }, buscaPaciente: async (req, res) => {

      let { busca } = req.body
      
      const allPacientes = await Paciente.findAll({
        where: {
         
            [Sequelize.Op.or]: [{
              cpf: busca
            }, {
              rg: busca
            },
            {
              nome: { [Sequelize.Op.like]: `%${busca}%` }
            }
          
          ]
      },
        attributes: ['id', 'nome', 'rg', 'cpf', 'dt_nascimento','obito'],
        order: [
          ['id', 'DESC'],
        ],
        include: {
          model: Situacao,
          raw: true,
          as: 'situacao'
        }
      }).then(data => {
        data = data.map(u => u.toJSON())
        console.log(data);

        res.render('pacientes', {
          title: 'lista de pacientes',
          userInfo: req.session.usuarioInfo,
          listaPacientes: data
        })

      });

      //
    },


    listaPaciente: async (req, res) => {
      /* const allPacientes = await Paciente.findAll({where:{obito:0,internado:1},
        attributes: ['id', 'nome', 'rg', 'cpf', 'dt_nascimento'],
        order: [
          ['id', 'DESC'],
        ],
        include: {
          model: Situacao,
          raw: true,
          as: 'situacao'
        }
      }).then(data => {
        data = data.map(u => u.toJSON())
        console.log(data);

        
      }); */
      res.render('pacientes', {
        title: 'lista de pacientes',
        userInfo: req.session.usuarioInfo,
      })

      //
    },

    listarPacientes: async (req, res) => {

    },
    showLaudoById: async (req, res) => {

      const idLaudo = req.params.laudoId;
      let laudo = await buscarLaudoById(idLaudo).then(async data => {
        parenteEnvio = await Parente.findOne({where:{id:data.dataValues.parente_envio_id}})
        console.log(data)
        //data = data.map(u => u.toJSON())
        res.render('single-laudo', {
          title: 'laudo individual',
          infoPaciente: data.dataValues,
          userInfo: req.session.usuarioInfo,
          moment: moment,
          parente:parenteEnvio

        })
      });

    },


    showPacienteId: async (req, res) => {

      const idPaciente = req.params.id;

      await Paciente.findOne({
        where: {
          id: idPaciente
        },
        attributes: ['id', 'nome', 'rg', 'cpf', 'dt_nascimento', 'endereco', 'telefone', 'internado', 'obito','genero','fuspom'],
        order: [
          ['createdAt', 'DESC'],
          ['laudo', 'dt_coleta', 'DESC'],
          ['internacao', 'createdAt', 'DESC'],


        ],
        include: [{
            model: Situacao,
            require: true,
            raw: true,
            as: 'situacao'
          },
          {
            attributes: ['id', 'dt_coleta', 'estadogeral_id', 'envio'],
            model: Laudo,
            require: true,
            raw: true,
            as: 'laudo',
            include: {
              model: EstadoGeral,
              require: true,
              raw: true,
              as: 'estadoGeral'
            }
          },
          {
            model: Parente,
            require: true,
            raw: true,
            as: 'parente',
            include: {
              model: Parentesco,
              require: true,
              raw: true,
              as: 'grParentesco'
            }
          },
          {
            model: Internacao,
            require: true,
            raw: true,
            as: 'internacao',
          }
        ]
      }).then(data => {
        let idade = moment().diff(data.dt_nascimento, 'years');

        //data = data.map(u => u.toJSON())
        console.log(data.dataValues);
        res.render('single-paciente', {
          title: 'single-paciente',
          infoPaciente: data.dataValues,
          userInfo: req.session.usuarioInfo,
          moment: moment,
          age: idade

        })
      });
    },

    cadastroParente: async (req, res) => {
      const allParentesco = await Parentesco.findAll();
      idPaciente = req.params.idPaciente
      res.render('cadastro-parentes', {
        title: 'Cadastro Parente',
        userInfo: req.session.usuarioInfo,
        parentesco: allParentesco,
        idpaciente: idPaciente
      })
    },
    cadastrarParente: async (req, res) => {
      const idPaciente = req.params.idPaciente;
      let {
        nomeParente,
        emailParente,
        tel1,
        tel2,
        endParente,
        selectParentesco
      } = req.body
      const newParente = await Parente.create({
        nome: nomeParente,
        email: emailParente,
        tel1: tel1,
        teltwo: tel2,
        endereco: endParente,
        grau_parentesco_id: selectParentesco,
        tipo_usuario_id: 17,
        admin_id: req.session.usuarioId,
        senha: bcrypt.hashSync(
          generatorPS.generate({
            length: 10,
            numbers: true
          }), 10)
      });
      const paciente = await Paciente.findOne({
        where: {
          id: idPaciente
        }
      });
      console.log(newParente)



      await ParentePaciente.create({
        parente_id: newParente.dataValues.id,
        paciente_id: paciente.dataValues.id
      });
      res.redirect('/paciente/' + idPaciente)



    },
    cadastroLaudo: async (req, res) => {
      idInternacao = req.params.idPaciente
      await Internacao.findOne({
        where: {
          id: idInternacao,
        },
        include: [{
          attributes: ['id', 'nome','rg','cpf'],
          model: Paciente,
          as: 'paciente',
          require:true

        }],

      }).then(async data => {
        //data = data.map(u => u.toJSON())
        console.log(data.dataValues);
        const allEstadoGeral = await EstadoGeral.findAll();
        const allTipoResultadoExame = await TiposDeResultadoExame.findAll();
        const allTiposReaspiracao = await Respiracao.findAll();
        console.log(allEstadoGeral)
        res.render('cadastro-laudo', {
          title: 'Cadastro Laudo',
          userInfo: req.session.usuarioInfo,
          infoPaciente: data.dataValues,
          estadoGeral: allEstadoGeral,
          resultadosExames: allTipoResultadoExame,
          respiracao:allTiposReaspiracao
        })
      })





    },

    cadastrarLaudo: async (req, res) => {
      let {
        dtColeta,
        selectEstadoGeral,
        acordado,
        oxigenio,
        saturacao,
        respirador,
        sedado,
        dialise,
        obs,
        aminas
      } = req.body
      console.log(req.body)
      let listadeErros = validationResult(req);
      if (dtColeta.isEmpty) {
        dtColeta = '0000-00-00'
      } else {
        dtColeta = moment(dtColeta).format("YYYY/MM/DD")
      }
      idPaciente = req.params.idPaciente
      let laudo = await Laudo.create({
        dt_coleta: dtColeta,
        estadogeral_id: selectEstadoGeral,
        acordado: acordado,
        oxigenio: oxigenio,
        saturacao: saturacao,
        respirador: respirador,
        sedado: sedado,
        dialise: dialise,
        obs: obs,
        paciente_id: idPaciente,
        admin_id: req.session.usuarioId,
        aminas: aminas

      })

      const {
        _options,
        dataValues
      } = laudo
      console.log(_options.isNewRecord)
      console.log(dataValues)

      if (_options.isNewRecord) {
        console.log(dataValues)

        res.redirect('/paciente/' + idPaciente)
        console.log('/paciente/' + idPaciente)
        /* res.render('sucesso-laudo', {
          title: 'laudo',
          msg: 'laudo cadastado com sucesso',
          userInfo: req.session.usuarioInfo
        }) */
      } else {
        res.render('erro', {
          title: 'erro',
          msg: 'Houve algum problema durante o cadastro do laudo',
          userInfo: req.session.usuarioInfo
        })
      }




      /*  .then(createdRecords => {
          const [ dataValues, created ] = Object.keys(createdRecords);
          if (created) {
           console.log(dataValues)
            res.render('sucesso-laudo', {
              title: 'laudo',
              msg:'laudo cadastado com sucesso'
            })
          } else {
            res.render('erro',{title:'erro',msg:'Houve algum problema durante o cadastro do laudo',userInfo:req.session.usuarioInfo})
          }
      }).catch(Sequelize.ValidationError, error => {
        console.log(error)
        //res.status(400).json(error);

      }); */
    },

    telaSucesso: (req, res) => {

      res.render('sucesso-laudo', {
        title: 'laudo',
        msg: 'laudo cadastado com sucesso',
        userInfo: req.session.usuarioInfo
      })


    },



    enviarEmailLaudoById: async (req, res) => {



      idLaudo = req.params.id;
       await buscarLaudoById(idLaudo).then( async laudo  => {
      
         let paciente = await Paciente.findOne(
           
           {
             where: { id: laudo.paciente_id },
             include: {
              model: Parente,
              require: true,
              raw: true,
              as: 'parente',
              include: {
                model: Parentesco,
                require: true,
                raw: true,
                as: 'grParentesco'
              }
            }
           },
          
           
         )        
         
           path.join(__dirname, 'templates/registration_confirmation.ejs')
           ejs.renderFile(path.join("./views/emails/laudoemail.ejs"), {
             infoLaudo: laudo.dataValues,
             infoPaciente:paciente.dataValues,
            moment: moment
          },  (err, data)=> {
            if (err) {
              console.log(err);
            } else{
                var mainOptions = {
                  from: 'HCPM',
                  to: paciente.dataValues.parente[0].email,
                  subject: 'laudo',
                  html: data
                };
              
              console.log("html data ======================>", mainOptions.html);
              Email.sendMail(mainOptions, async (err, info) => {
                if (err) {
                  console.log(err);
                } else {
                  var dia_envio = await moment.tz(new Date(),'America/Sao_Paulo').format('YYYY-MM-DD');

                  console.log("teste envio")
                  console.log(paciente.dataValues.parente[0].id)
                  laudo.envio = 1,
                    laudo.data_envio = dia_envio;
                  laudo.parente_envio_id = paciente.dataValues.parente[0].id
                  await laudo.save();
                  res.redirect('back');
                }
              });
            }  
          }); 
        })
  },
    
    
  atestarAltaPaciente:async (req, res) => {
  
idInternacao = req.params.idPaciente
    let internacao = await Internacao.findOne({
      where: { id: idInternacao },
      returning: true,
      plain: true
    })
    internacao.status = 0;
    await internacao.save()
    
    
    
    

  },
  
  internarPaciente:async (req, res) => {
    let paciente = await Paciente.findOne({
      where: { id: idPaciente },
      returning: true,
      plain: true
    })
    paciente.internado = 1;
    await paciente.save().then(data => {
      const { _changed } = data;
      if (_changed.isEmpty) {
        res.render('erro',{msg:'Houve um erro ao internar o paciente, talvez ele ja esteja internado', userInfo: req.session.usuarioInfo,title:"internção"})
      } else {
        res.render('sucesso-laudo',{msg:'Sucesso em internar o paciente', userInfo: req.session.usuarioInfo,title:"Internação"})
      }
      console.log(data)
    });

    
      },
    

  atestarObito: async(req, res) => {
    let paciente = await Paciente.findOne({
      where: { id: idPaciente },
      returning: true,
      plain: true
    })
    paciente.obito = 1;
    await paciente.save().then(data => {
      let { _changed } = data;
      if (utils.isEmpty(_changed)) {
        res.render('erro',{msg:'Houve um erro ao atestar óbito', userInfo: req.session.usuarioInfo,title:"Óbito"})
      } else {
        res.render('sucesso-laudo',{msg:'Óbito registrado', userInfo: req.session.usuarioInfo,title:"Óbito"})

      }
      console.log(data)
    });
    }
    
    
    
  }
  const buscarLaudoById = async (idLaudo) => {
    let laudo = await Laudo.findOne({
      where: {
        id: idLaudo

      },
      attributes: {
        exclude: ["admin_id"]
      },
      // attributes: ['id', 'nome', 'rg', 'cpf', 'leito', 'dt_nascimento', 'endereco', 'telefone', 'internado', 'dt_internacao', 'leito', 'obito'],

      include: {
        model: EstadoGeral,
        require: true,
        raw: true,
        as: 'estadoGeral'

      }

    })
    return laudo;
  }

module.exports = homeController;