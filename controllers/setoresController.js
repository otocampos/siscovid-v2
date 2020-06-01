const {
    Leito,
    Internacao,
    LeitoInternacao,
    Paciente,
    TiposDeResultadoExame,
    Laudo,
    TipoLaudo,
    Respiracao,
    EstadoGeral,
    Local
} = require('../models')
const moment = require('moment-timezone');
const daoLeitos = require('../DAO/daoLeitos')
const daoLeitoInternacao = require('../DAO/daoInternacao')
const daoLaudos = require('../DAO/daoLaudos')


const setoresController = {

    listaSetoresAtivos: async (req, res) => {
        lista = await Local.findAll({
            where: {
                status: 1
            }
        })
        console.log(lista)
        res.render('locals', {
            title: 'lista de Setores',
            userInfo: req.session.usuarioInfo,
            listaSetores: lista
        })
    },

    listaInternacaoBySetor: async (req, res) => {
        
        const idLocal = req.params.idLocal
        let leitoVago = await Leito.findAll({where: {
            idlocal: idLocal,
            ocupado:0
        }})
        
local = await Local.findOne({where:{id:idLocal}})
        let allLeitosInternacao = await Leito.findAll(
            {
                where: {
                    idlocal: idLocal,
                    ocupado:1
                },
                include: [{
                    where:{status:1},
                    require: true,
                    model: LeitoInternacao,
                    as: 'leito_internacao',

                    include: [{
                        where: { status: 1 },
                        require: true,
                        model: Internacao,
                        as: 'internacao',
                      
    
                        include: [{
                            require: true,
                            model: Paciente,
                            as: 'paciente'
                        },
                            {
                                order: [
                                    [Laudo, 'dt_coleta', 'DESC'],
                    
                                    
                                  ],
                            require: true,
                            model: Laudo,
                            as: 'laudo',
                            include:[ {
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
                        }
                        
                        ]
                        
                    }]
                }],
                
               
            }



        )

       
        res.render('pacientes-internados-local', {
            title: 'Pacientes internados',
            userInfo: req.session.usuarioInfo,
            listaPacientes: allLeitosInternacao,
            setor: local,
            moment: moment,
            leitosVagos:leitoVago
        })



         allLeitosInternacao.forEach(element => {
             element.leito_internacao.forEach(data => {
                 console.log(data.dataValues)
             }) 
           //  console.log(element)
       

});  
    }
}


module.exports = setoresController;