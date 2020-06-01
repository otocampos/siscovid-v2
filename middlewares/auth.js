const path = require('path')
const bcrypt = require('bcrypt');
const {
  Admin,Tipousuario
} = require('../models')
  


  
     


autenticar = async(req, res, next) => {
  let {
    cpflogin,
    password
  } = req.body;

  const User = await Admin.findOne({
    where: {
      cpf: cpflogin
    }
  });

  if (User === null) {
    res.render('login', { title: 'Login',erro: 'usuario e/ou senha incorretos' })
  } else {
    
    if (bcrypt.compareSync(password, User.senha)) {
      // res.render('/painel-admin')
        console.log('password correto')
        req.session.usuarioId = User.dataValues.id;
        //res.locals.usuarioId =  req.session.usuarioId;
        //req.session.usuarioInfo = { nome:User.nome,matricula:User.dataValues.rg};
       // res.locals.usuarioInfo = req.session.usuarioInfo; 
    } else {
      res.render('login', { title: 'Login',erro: 'usuario e/ou senha incorretos' })
      res.end()
    } next();
  }
    
    
    
     
}


redirectPagina = (req, res, next) => {
  if (req.session.usuarioId == null || req.session.usuarioId ==undefined) {
    
    if (req.route.path == '/') {
      res.redirect('/admin/login')
      next();
    }
    
  } else if (req.route.path == '/login' || req.route.path == '/') {
    console.log(req)
    console.log(req.session.usuarioInfo.permissao)
    switch (req.session.usuarioInfo.permissao) {
      case "Admin": res.redirect('/admin')
      case "Operador":res.redirect('/painel-hospital')  
    } 
  
  } else if (req.route.path == '/painel-hospital') {
    switch (req.session.usuarioInfo.permissao) {
      case "Admin": res.redirect('/admin')
    } 
    } next();
},
 


  
 
  isAdmin = (req, res, next) => {
    if (req.session.usuarioId == null || req.session.usuarioId == undefined) {
     res.redirect('/admin/login')
  
    } else {
      if (req.session.usuarioInfo.permissao == 'Admin') {
        next();
      } else {

        res.redirect('/admin/login')
      }
  }  
  },
  isOperador = (req, res, next) => {
    if (req.session.usuarioId == null || req.session.usuarioId == undefined) {
     res.redirect('/admin/login')
  
    } else {
      if (req.session.usuarioInfo.permissao == 'Operador') {
        next();
      } else {

        res.redirect('/admin/login')
      }
  }  
  },
  identificarPerfil = async(req, res, next) => {
    if (req.session.usuarioId != undefined) {
    
      console.log(req.session.usuarioId)
      const sessao =req.session.usuarioId ;
  
      const user = await Admin.findOne({
        
      
        where: {
          id: sessao
        },
        include: {
          model: Tipousuario,
          required: true,
          raw: true,
          as: 'tipo'
        }
      });
      if (user === null) {
        console.log('Not found!');
      } else {
        userPermission = user.tipo.nome
        req.session.usuarioInfo = { nome: user.nome, matricula: user.dataValues.rg,permissao:userPermission } 
      next()
      }
    } else {
      res.redirect('/admin/login')
    }
  }


  
  logout = async (req, res, next) => {
  
  req.session.destroy();
    res.redirect('/')



  }









module.exports = { autenticar,isAdmin,identificarPerfil,redirectPagina,logout,isOperador }