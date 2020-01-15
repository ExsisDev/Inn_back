const _ = require('lodash');
const Resource = require('../models/Resource');

export async function getResourcesByAllyId(req, res) {
    const id_ally = parseInt(req.params.allyId);

    let answer;

    if (!Number.isInteger(id_ally) || id_ally <= 0) {
        return res.status(400).send("Id inválido. el id del aliado debe ser un entero positivo");
    }
    try {
        answer = await getAllyResources(id_ally);        
    } catch (error) {
        console.log(error);
        return res.status(500).send("Algo salió mal. Mira los logs para mayor información");
    }
    if (answer.code && answer.code === 404) {
        return res.status(404).send(answer.message);
    }
    return res.status(200).send(answer);
}

/**
 * Obtener los recursos correspondientes a un aliado
 * @param {Number} id_ally Entero positivo que representa el id del aliado
 * @returns {Array} Un arreglo con los recursos encontrados
 */
function getAllyResources(id_ally) {
    return Resource.findAll({
        where: { fk_id_ally: id_ally },
        attributes: [
            'id_resource',
            'resource_name',
            'resource_profile',
            'resource_experience'
        ]
    }).then( result => {
        if (result === null) {
            const error = {
                code: 404,
                message: "No se encontraron recursos con el id dado"
            };
            return error;
        }
        return result;
    }).catch(error => {
        console.log(error);
        throw error;
    })
}