const {
    Local,
    Leito,
    Internacao,
    LeitoInternacao,
    Paciente,
    TiposDeResultadoExame,
    Laudo,
    TipoLaudo,
    Respiracao,
    EstadoGeral,
    Situacao
} = require('../models')
const moment = require('moment-timezone');
const daoLeitos = require('../DAO/daoLeitos')
const daoLeitoInternacao = require('../DAO/daoInternacao')
const daoLaudos = require('../DAO/daoLaudos')
const Sequelize = require('sequelize');


const InternacaoController = {

    InternacaoPaciente: async (req, res) => {
        const allLeitos = await daoLeitos.getAllLeitosVagos();
     /*    const tipoResultadoExame = await TiposDeResultadoExame.findAll(); */
        idPaciente = req.params.id
        res.render('cadastro-internacao', {
            title: 'Internação ',
            idpaciente: idPaciente,
            userInfo: req.session.usuarioInfo,
            leitosVagos: allLeitos,
            erro: ''
        })
    },

    InternarPaciente: async (req, res) => {

        let {
            origemPaciente,
            dtInternacaoPaciente,
            selectLeito
        } = req.body
        dtInternacao = moment(dtInternacaoPaciente).format("YYYY/MM/DD HH:mm")
        var leito = await daoLeitos.getLeitoById(selectLeito);
        console.log("teste leito")
        console.log(leito)
        const leitoInternacao = await daoLeitoInternacao.getInternacaoAtivaByLeito(selectLeito)
        if (leitoInternacao != null) {
            res.render('erro', {
                msg: 'Leito Talvez encontra-se ocupado',
                userInfo: req.session.usuarioInfo,
                title: "internação"
            })
        } else {

        let createdRecords= await Internacao.findOrCreate({
                where: {
                    id_paciente: req.params.id,
                    status: 1
                },

                defaults: {
                    origem: origemPaciente,
                    data_entrada: dtInternacaoPaciente,
                    id_paciente: req.params.id,
                    id_admin: req.session.usuarioId
                }
            })
                const [data, created] = createdRecords;
            if (created) {
                    console.log('teste internacao leito')
                    console.log(data)
                    await daoLeitoInternacao.criarLeitoInternacao(data, selectLeito,req.session.usuarioId)
                        leito.ocupado = 1;
                    await leito.save()
                    
                        res.render('sucesso-laudo', {
                            msg: 'Sucesso em internar o paciente',
                            userInfo: req.session.usuarioInfo,
                            title: "Internação"
                        })
                   
                    
                    
                } else {
                    res.render('erro', {
                        title: 'erro',
                        msg: 'Usuário já possui uma internação ativa, é preciso dar Alta no sistema',
                        userInfo: req.session.usuarioInfo
                    })
                }



        }
    },

    singleInternacao: async(req, res) => {
        idInternacao = req.params.id

      let idLeitoAtual=  await LeitoInternacao.findOne(
            {where:{id_internacao:idInternacao,status:1}
                
          })
        if (idLeitoAtual != null) {
            var leitoAtual = await Leito.findOne({
                require: true,
            

                where: { id: idLeitoAtual.id_leito },
                include: [{
                    model: Local,
                    require: true,
                    as: 'local'
                }]
            })
          
            console.log(leitoAtual)
        } 
        let allLeitosInternacao = await Internacao.findOne({
           
            where: { id: idInternacao },
            include: [{
                order: [
                    ['createdAt', 'DESC'],

                    
                  ],
              model: Leito,
                as: 'leito',
                include: [
                    {
                require: true,
                model: Local,
                as: 'local'
              }]
          },
                {
                    order: 
                        ['createdAt', 'DESC'],
    
                        
                      
            exclude: ["admin_id"],
            model: Laudo,
            require: true,
            raw: true,
            as: 'laudo',
              include: [
                  {
              model: TipoLaudo,
              require: true,
              as: 'tipoLaudo'
              },
               {
                model: TiposDeResultadoExame,
                require: true,
                as: 'resultado'
              },
               {
                model: Respiracao,
                require: true,
                as: 'respiracao'
              },
               {
                model: EstadoGeral,
                require: true,
                as: 'estadoGeral'
                  }
                ]
                },
                {
                    order: [
                        [LeitoInternacao, 'updatedAt', 'DESC'],
        
                        
                      ],
                    require: true,
                    model: LeitoInternacao,
                    as: 'leito_internacao',
                    include: [{
                        model: Leito,
                        as: 'leito',
                        require:true,
                        include: [
                            {
                        require: true,
                        model: Local,
                        as: 'local'
                      }]
                    }]
                    
                },
         
              {
                attributes: ['id', 'nome', 'obito'],
                  require: true,
                  model: Paciente,
                  as:'paciente'
              },
              
          
          ]




        })

console.log(allLeitosInternacao)
        const allLeitos = await daoLeitos.getAllLeitosVagos();

        res.render('single-internacao', {
            title: 'Internações',
            idInternacao: idInternacao,
            userInfo: req.session.usuarioInfo,
            leitosVagos: allLeitos,
            leito: leitoAtual,
            historicoLeitos: allLeitosInternacao,
            moment:moment,
            erro: ''
        })

    },
    transferirDeLeito: async (req, res) => {
        let { leitoAtual, proximoLeito } = req.body
        idInternacao = req.params.id
        if (proximoLeito != null) {
            console.log(leitoAtual, proximoLeito, idInternacao)
            await daoLeitos.liberarVagaLeito(idInternacao, leitoAtual)
            await daoLeitos.ocuparVagaLeito(idInternacao, proximoLeito)
            res.redirect('back');

        } else {
            res.render('erro', {
                title: 'erro',
                msg: 'Escolha um leito para transferencia',
                userInfo: req.session.usuarioInfo
            })        }
    },
    altaPaciente: async (req, res) => {
        idInternacao = req.params.idPaciente
       await daoLeitoInternacao.darAltaLeitoInternacao(idInternacao);
        await daoLaudos.cadastrarLaudoAlta(req.body,idInternacao,req.session.usuarioId)
        console.log(req.body)
        res.redirect(`/paciente/${idInternacao}/internacao`)


    },
    obitoPaciente: async (req, res) => {
        idInternacao = req.params.idPaciente
       await daoLeitoInternacao.darAltaLeitoInternacao(idInternacao);
        await daoLaudos.cadastrarLaudoObito(req.body,idInternacao,req.session.usuarioId)
        res.redirect(`/paciente/${idInternacao}/internacao`)
    },
    laudoColetaSwab: async (req, res) => {
        idInternacao = req.params.idPaciente
        await daoLaudos.cadastrarLaudoColetaSwab(req.body,idInternacao,req.session.usuarioId)
        res.redirect(`/paciente/${idInternacao}/internacao`)
    },
    laudoResultadoColetaSwab: async (req, res) => {
        idInternacao = req.params.idPaciente
        await daoLaudos.cadastrarLaudoResultadoSwab(req.body,idInternacao,req.session.usuarioId)
        res.redirect(`/paciente/${idInternacao}/internacao`)
    },
    laudoRespiracao: async (req, res) => {
        idInternacao = req.params.idPaciente
        await daoLaudos.cadastrarRespiracao(req.body,idInternacao,req.session.usuarioId)
        res.redirect(`/paciente/${idInternacao}/internacao`)
    },
    laudoCovid: async (req, res) => {
        idInternacao = req.params.idPaciente
        await daoLaudos.cadastrarLaudoCovid(req.body,idInternacao,req.session.usuarioId)
        res.redirect(`/paciente/${idInternacao}/internacao`)
    },
    estatisticas: async (req, res) => {
        let allTipoLAudo = await TipoLaudo.findAll();
        res.render('single-estatistica', {
            title: 'Estatísticas',
            userInfo: req.session.usuarioInfo,
            tipoLaudo: allTipoLAudo,
            moment:moment
        })
    
    },
    buscaEstatisticas: async (req, res) => {
        let allTipoLAudo = await TipoLaudo.findAll();
        let { selectTipo, dtBusca, dtBuscaFinal } = req.body
        console.log('teste busca final')
       console.log(dtBuscaFinal)
        dtBusca = moment.tz(dtBusca, 'America/Sao_Paulo').format('YYYY-MM-DD')
        if (Object.keys(req.body.dtBuscaFinal).length === 0) {
            dtBuscaFinal =`${dtBusca} 23:59:59`
        } else {
            dtBuscaFinal =`${dtBuscaFinal} 23:59:59`

        }
        





        const { count, rows } = await Laudo.findAndCountAll({
            where: {
                tipolaudo_id: selectTipo,
                dt_coleta :{ [Sequelize.Op.between]: [dtBusca , dtBuscaFinal] }

            },
            include: [{
                model: Paciente,
                require: true,
                as: 'paciente',
                include: {
                    model: Situacao,
                    raw: true,
                    as: 'situacao'
                  }
               
            }]
        })
        res.render('single-estatistica', {
            title: 'Estatísticas',
            userInfo: req.session.usuarioInfo,
            tipoLaudo: allTipoLAudo,
            moment: moment,
            resultados: rows,
            quantidade:count
        })
        console.log(rows)
    }




}

module.exports = InternacaoController;