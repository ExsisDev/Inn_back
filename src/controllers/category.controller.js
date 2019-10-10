const { validateBodyCategoryCreation, validateBodyCategoryUpdate } = require('../schemas/category.validation');
const Category = require('../models/Category');

export async function createCategory(req, res) {
   //Validación del body
   const { error } = validateBodyCategoryCreation(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //Cración del artista
   const categoryAttributes = req.body;
   return Category.create(
      categoryAttributes,
      {
         fields: ['category_name', 'details']
      }).then((result) => {
         result ? res.status(200).send(result) : res.status(500).send("No se pudo crear el elemento");
      }).catch((error) => {
         res.status(409).send(error);
      });
}

export async function getAllCategories(req, res) {
   //Obtener todos los artistas
   return Category.findAll({
      order: ['id_category']
   }).then((result) => {
      result ? res.send(result) : res.status(404).send("No hay elementos disponibles");
   }).catch((error) => {
      res.status(500).send(error);
   })
}

export async function getByCategoryId(req, res) {
   //Obtener el elemento
   const { id } = req.params;
   return Category.findOne({
      where: {
         id_category: id
      }
   }).then((result) => {
      result ? res.status(200).send(result) : res.status(404).send(`No existe el elemento con id ${id}`);
   }).catch((error) => {
      res.status(500).send(error);
   });
}

export async function updateCategory(req, res) {
   //Validación del body
   const { error } = validateBodyCategoryUpdate(req.body);
   if (error) return res.status(400).send(error.details[0].message);

   //Actualización de la categorìa
   const { id } = req.params;
   const bodyAttributes = req.body;
   Category.findByPk(id).then((result) => {
      if (!result) res.status(404).send(`No existe el elemento con id ${id}`);
      return result.update(bodyAttributes).then((updated) => {
         res.status(200).send(updated);
      }).catch((error) => {
         res.status(500).send(error);
      });
   }).catch((error) => {
      res.status(500).send(error);
   });
}

export async function deleteCategory(req, res) {
   const { id } = req.params;
   Category.findByPk(id).then((result) => {
      if (!result) res.status(404).send(`No existe el elemento con id ${id}`);
      return Category.destroy({
         where: {
            id_category: id
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



