const { validateBodyUserCreation, validateUserAuth, validateBodyUserUpdate } = require('../schemas/user.validation');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

export async function createUser(req, res) {
   //Validacion del body
   const { error } = validateBodyUserCreation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //Cración del usuario
   const userAttributes = req.body;

   User.findOne({
      where: {
         email: userAttributes.email
      }
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

               const token = jwt.sign({ _id: userAttributes.id }, config.get('jwtPrivateKey'));
               return res.header('x-auth-token', token).status(200).send(_.pick(created, ['id_user', 'name', 'email']))

            }).catch((creationError) => {
               return res.status(409).send(creationError);
            });
      });
   }).catch((error) => {
      res.status(500).send(error);
   });
}

export async function authenticateUser(req, res) {
   //Validacion del body
   const { error } = validateUserAuth(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   const userAttributes = req.body;

   //Verificacion del usuario registrado
   User.findOne({
      where: {
         email: userAttributes.email
      }
   }).then((result) => {
      if (!result) return res.status(400).send("Invalid email or password");

      bcrypt.compare(userAttributes.password, result.password, function (compareError, compareResponse) {
         if (!compareResponse) return res.status(400).send("Invalid email or password");
         const token2 = User.generateAuthToken();
         return res.header('x-auth-token', token2).send("User authenticated");
      });

   }).catch((error) => {
      res.status(500).send(error);
   });
}