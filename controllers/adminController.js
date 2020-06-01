const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const config = require('../config/database');
const sequelize = require('sequelize');
const {
  Tipousuario,
  Situacao,
  Parentesco,
  Admin,
  EstadoGeral
} = require('../models')
const {
  check,
  validationResult,
  body
} = require('express-validator')

const db = new sequelize(config);

const adminController = {
  cadastroUsuarioAdmin: async (req, res) => {
    const allTiposdeUsuario = await Tipousuario.findAll();
    //console.log(pacientes[0].dataValues.nome);
    console.log('teste tela cadastro')
   
    console.log(req.session.usuarioId)
    res.render('cadastro-perfis', {
      title: 'teste',
      tipos: allTiposdeUsuario,
      userInfo:req.session.usuarioInfo


    })
  },

  painelAdmin: async (req, res) => {
    console.log('painel admin')
    console.log(req.session.usuarioId)

    const {
      allTiposdeUsuario,
      allSituacaoCadastral,
      allGrParentesco,
      allEstadoGeral
    } = await listarTiposPainelAdmin()
    res.render('painel-admin', {
      title: 'Painel Admin',
      tipos: allTiposdeUsuario,
      situacoes: allSituacaoCadastral,
      grparenteso: allGrParentesco,
      estadogeral:allEstadoGeral,
      userInfo:req.session.usuarioInfo

    })
    
    //const pacientes = await TipoUsuario.findAll();
    //console.log(pacientes[0].dataValues.nome);
  },
  cadastrarTipoUsuario: async (req, res, next) => {
    let tipo = Object.getOwnPropertyNames(req.body)[0];
    if (tipo == 'nometipo') {

      let {
        nometipo
      } = req.body;
      await Tipousuario.create({
        nome: nometipo
      });
      console.log(nometipo)


    } else if (tipo == 'situacaoCadastral') {

      let {
        situacaoCadastral
      } = req.body;
      await Situacao.create({
        nome: situacaoCadastral
      });
      console.log(situacaoCadastral)

    } else if (tipo == 'grauParentesco') {
      let {
        grauParentesco
      } = req.body;
      await Parentesco.create({
        nome: grauParentesco
      });
      console.log(grauParentesco)
    } else if (tipo == 'nomeEstadoGeral') {
      let {
        nomeEstadoGeral
      } = req.body;
      await EstadoGeral.create({
        nome: nomeEstadoGeral
      });
    }
    res.redirect('back');

  },

  cadastrarUsuarios: async (req, res) => {
    
    let listadeErros = validationResult(req);
    let {
      nomeSystemUser,
      emailSystemUser,
      rgSystemUser,
      cpfSystemUser,
      passwordSystemUser,
      selectTipoUsuario
    } = req.body
    if (listadeErros.isEmpty()) {
      let user = await Admin.create({
        nome: nomeSystemUser,
        email: emailSystemUser,
        rg: rgSystemUser,
        cpf: cpfSystemUser,
        senha: passwordSystemUser,
        tipoId: selectTipoUsuario
      });

      console.log(user);
      const {
        _options,
        dataValues
      } = user
      console.log(_options.isNewRecord)
      console.log(dataValues)

      if (_options.isNewRecord) {
        res.render('sucesso', {
          title: 'cadastro de usuarios',

          nome: dataValues.nome,
          email: dataValues.email,
          cpf: dataValues.cpf,
          rg: dataValues.rg,
          userInfo: req.session.usuarioInfo

        })

      } else {
        console.log(listadeErros)
      }


    }
  },
  login: (req, res) => {
    res.render('login', {
      title: 'Login',
      erro: ''
    })
  },

  logar: async (req, res) => {

    
      //  res.redirect('/')

  }







}
const listarTiposPainelAdmin = async () => {
  const allTiposdeUsuario = await Tipousuario.findAll();
  const allSituacaoCadastral = await Situacao.findAll();
  const allGrParentesco = await Parentesco.findAll();
  const allEstadoGeral = await EstadoGeral.findAll();

  return {
    allTiposdeUsuario,
    allSituacaoCadastral,
    allGrParentesco,
    allEstadoGeral
  }
}




module.exports = adminController;