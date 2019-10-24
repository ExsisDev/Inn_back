const { validateBodyUserCreation, validateUserAuth, validateBodyUserUpdate } = require('../schemas/user.validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const User = require('../models/User');


/**
 * Creación de un usuario: 
 * 1. verificando el body, 
 * 2. verificando la existencia del usuario,
 * 3. creando el usuario 
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function createUser(req, res) {
   // Validacion del body
   const userAttributes = req.body;
   const { error } = validateBodyUserCreation(userAttributes);
   if (error) return res.status(400).send(error.details[0].message);

   // Cración del usuario
   User.findOne({
      where: { email: userAttributes.email }
   }).then((result) => {

      if (result) return res.status(400).send("User already registered");
      bcrypt.hash(userAttributes.password, 10).then(function (hash) {
         userAttributes.password = hash;
         User.create(
            userAttributes,
            {
               fields: ['name', 'password', 'email']
            }).then((created) => {

               if (!created) return res.status(500).send("User could not be created");
               const token = created.generateAuthToken();
               return res.header('x-auth-token', token).status(200).send(_.pick(created, ['id_user', 'name', 'email']));

            }).catch((creationError) => {
               return res.status(409).send(creationError);
            });
      });

   }).catch((error) => {
      res.status(500).send(error);
   });
}


/**
 * Validación de email y constraseña:
 * 1. Validando del body
 * 2. Verificando el correo y la contraseña
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function authenticateUser(req, res) {
   // Validacion del body
   const userAttributes = req.body;
   const { error } = validateUserAuth(userAttributes);
   if (error) return res.status(400).send(error.details[0].message);

   // Verificacion del usuario registrado
   User.findOne({
      where: { email: userAttributes.email }
   }).then((result) => {

      if (!result) return res.status(400).send("Invalid email or password");
      bcrypt.compare(userAttributes.password, result.password, function (compareError, compareResponse) {
         if (!compareResponse) return res.status(400).send("Invalid email or password");
         const token = result.generateAuthToken();
         return res.header('x-auth-token', token).send("User authenticated");
      });

   }).catch((error) => {
      res.status(500).send(error);
   });
}


/**
 * Retorna el usuario actual de acuerdo al token en el header
 *  
 * @param {Request} req 
 * @param {Response} res 
 * @return {promise} promise
 */
export async function getCurrentUser(req, res){
   // Encontrar el usuario con id en req.user.id_user
   User.findByPk(req.user.id_user).then((result) => {
      if(!result) return res.status(400).send("User does not exist");
      return res.send(_.pick(result, ['id_user', 'name', 'email']));
   });
}