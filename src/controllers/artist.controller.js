const { validateBodyArtistCreation, validateBodyArtistUpdate } = require('../schemas/artist.validation');
const Artist = require('../models/Artist');

export async function createArtist(req, res) {
    //Validación del body
    const { error } = validateBodyArtistCreation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Cración del artista
    const { full_name, email, address, phone_number, start_date, birth_date } = req.body;
    return Artist.create({
        full_name,
        email,
        address,
        phone_number,
        start_date,
        birth_date
    }, {
        fields: ['full_name', 'email', 'address', 'phone_number', 'start_date', 'birth_date']
    }).then((result) => {
        result ? res.status(200).send(result) : res.status(500).send("No se pudo crear el elemento");
    }).catch((error) => {
        res.status(409).send(error);
    });
}

export async function getAllArtists(req, res) {
    //Obtener todos los artistas
    return Artist.findAll({
        order: ['id_artist']
    }).then((result) => {
        result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
    }).catch((error) => {
        res.status(500).send(error);
    })
}

export async function getByArtistId(req, res) {
    //Obtener el elemento
    const { id } = req.params;
    return Artist.findOne({
        where: {
            id_artist: id
        }
    }).then((result) => {
        result ? res.status(200).send(result) : res.status(404).send(`No existe el elemento con id ${id}`);
    }).catch((error) => {
        res.status(500).send(error);
    });
}

export async function updateArtist(req, res) {
    //Validación del body
    const { error } = validateBodyArtistUpdate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Actualización del artista
    const { id } = req.params;
    const bodyAttributes = req.body;
    Artist.findByPk(id).then((result) => {
        if (!result) res.status(404).send(`No existe el elemento con id ${id}`);
        return result.update(bodyAttributes).then((updated) => {
            res.status(200).send(updated);
        }).catch((error) => {
            res.status(500).send(error);
            console.log("En el update")
        });
    }).catch((error) => {
        res.status(500).send(error);
        console.log("En el find")
    });
}

export async function deleteArtist(req, res) {
    const { id } = req.params;
    Artist.findByPk(id).then((result) => {
        if (!result) res.status(404).send(`No existe el elemento con id ${id}`);
        return Artist.destroy({
            where: {
                id_artist: id
            }
        }).then((deleted) => {
            res.status(200).send(result);
        }).catch((error) => {
            res.status(500).send(error);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
}


