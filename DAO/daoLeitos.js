const {
    Local,
    Leito,
    LeitoInternacao,
    
} = require('../models')

const daoLeitos = {
     getAllLeitosVagos :async ()=> {
    const allLeitos = await Local.findAll({
        include: [{
            where: {
                status: 1,
                ocupado: 0
            },
            attributes: ['id', 'numero'],
            model: Leito,
            raw: true,
            as: 'leito',
        }]
    })
        return allLeitos
    },
    getLeitoById :async (idLeito)=> {
        const leitoById = await Leito.findOne({ where: { id: idLeito } })
            return leitoById
    },

    liberarVagaLeito: async (idInternacao) => {
        leitoInternacao = await LeitoInternacao.findOne({ where: { id_internacao: idInternacao, status: 1 } })
        leitoInternacao.status = 0;
        await leitoInternacao.save()

      let leito = await Leito.findOne({where:{id:leitoInternacao.id_leito}})
        leito.ocupado = 0;
      await   leito.save();
       
    },
    ocuparVagaLeito: async (idInternacao,idLeito) => {
       await LeitoInternacao.create({ id_internacao: idInternacao, id_leito: idLeito })
        let leito = await Leito.findOne({where:{id:idLeito}})
        leito.ocupado = 1
      await  leito.save()


    },
    
    
    




}



module.exports = daoLeitos;