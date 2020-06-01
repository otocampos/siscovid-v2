const {
    Local,
    Leito,
    LeitoInternacao,
    Internacao
    
} = require('../models')
const daoLeitos = require('../DAO/daoLeitos')

const daoInternacao = {
     internarPaciente :async ()=> {

        return allLeitos
    },



    getInternacaoAtivaByLeito: async (idLeito) => {
let internacaoAtiva  =   LeitoInternacao.findOne({
            where: {
                id_leito: idLeito,
                status: 1
            },
            returning: true,
            plain: true
        })
        return internacaoAtiva;

    },

    criarLeitoInternacao: async (data,idLeito,idAdmin) => {
        await LeitoInternacao.create({
            id_internacao: data.id,
            id_leito: idLeito,
            id_admin: idAdmin

        })
        
            },
    darAltaLeitoInternacao: async ( idInternacao) => {

        //idInternacao = req.params.idPaciente

        let internacao = await Internacao.findOne({
          where: { id: idInternacao },
          returning: true,
          plain: true
        })
        internacao.status = 0;
      await internacao.save()



        
daoLeitos.liberarVagaLeito(idInternacao)




        
        
        
        
        
        
        
                
                    }




}



module.exports = daoInternacao;