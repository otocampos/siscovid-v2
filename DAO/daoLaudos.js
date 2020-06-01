const {
    Local,
    Leito,
    LeitoInternacao,
    Laudo,
    Paciente,
    Internacao

} = require('../models')
const moment = require('moment-timezone');

const daoLaudo = {
    cadastrarLaudoAlta: async (data, idInternacao, idAdmin) => {

        await Laudo.create({
            dt_coleta: data.dataColetaAlta,
            tipolaudo_id: 1,
            id_internacao: idInternacao,
            obs: data.obsAlta,
            paciente_id: data.paciente,
            admin_id: idAdmin
        })
        internacao = await Internacao.findOne({
            where: {
                id: idInternacao
            }
        })
        internacao.data_saida = moment.tz(new Date(), 'America/Sao_Paulo').format('YYYY-MM-DD')
        await internacao.save();
    },
    cadastrarLaudoObito: async (data, idInternacao, idAdmin) => {

        await Laudo.create({
            dt_coleta: data.dataColetaObito,
            tipolaudo_id: 2,
            id_internacao: idInternacao,
            obs: data.obsObito,
            paciente_id: data.paciente,
            admin_id: idAdmin
        })

        let paciente = await Paciente.findOne({
            where: {
                id: data.paciente
            }
        })
        paciente.obito = 1;
        await paciente.save();
    },

    cadastrarLaudoColetaSwab: async (data, idInternacao, idAdmin) => {

        await Laudo.create({
            dt_coleta: data.dataColetaSwab,
            tipolaudo_id: 3,
            id_internacao: idInternacao,
            obs: data.obsColetaSwab,
            paciente_id: data.paciente,
            admin_id: idAdmin
        })


    },
    cadastrarLaudoResultadoSwab: async (data, idInternacao, idAdmin) => {

        await Laudo.create({
            dt_coleta: data.dataResultadoSwab,
            tipolaudo_id: 4,
            id_resultado_exame: data.selectResultadoSwab,
            id_internacao: idInternacao,
            obs: data.obsResultadoSwab,
            paciente_id: data.paciente,
            admin_id: idAdmin
        })


    },
    cadastrarRespiracao: async (data, idInternacao, idAdmin) => {

        await Laudo.create({
            dt_coleta: data.dataRespiracao,
            tipolaudo_id: 5,
            id_respiracao: data.selectRespiracao,
            id_internacao: idInternacao,
            obs: data.obsRespiracao,
            paciente_id: data.paciente,
            admin_id: idAdmin
        })


    },
    cadastrarLaudoCovid: async (data, idInternacao, idAdmin) => {
        let dtColeta = data.dtColeta
        if (dtColeta.isEmpty) {
            dtColeta = '0000-00-00'
        } else {
            dtColeta = moment(data.dtColeta).format("YYYY/MM/DD HH:mm")
        }
        let laudo = await Laudo.create({
            dt_coleta: dtColeta,
            estadogeral_id: data.selectEstadoGeral,
            acordado: data.acordado,
            oxigenio: data.oxigenio,
            saturacao: data.saturacao,
            respirador: data.respirador,
            sedado: data.sedado,
            dialise: data.dialise,
            obs: data.obs,
            paciente_id: data.paciente,
            admin_id: idAdmin,
            aminas: data.aminas,
            tipolaudo_id: 6,
            id_internacao: idInternacao,

        })






    },

}



module.exports = daoLaudo;