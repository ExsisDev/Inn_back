const { validateArtist } = require('../schemas/validationSchemas');
const Artist = require('../models/Artist');

export async function createArtist (req, res) {
   //Validación del body
   const { error } = validateArtist(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //Cración del artista
   const { full_name, email, address, phone_number, start_date, birth_date } = req.body;
   try {
       let newArtist = await Artist.create({
           full_name,
           email,
           address,
           phone_number,
           start_date,
           birth_date
       }, {
           fields: ['full_name', 'email', 'address', 'phone_number', 'start_date', 'birth_date']
       });
       if (newArtist) {
           res.send(newArtist);
       }
   } catch (err) {
       res.status(500).send(err.parent.detail);
   }
}


