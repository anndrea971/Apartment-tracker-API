const router = require('express').Router();
const apartmentsController = require('../controllers/apartments');

router.get('/', apartmentsController.getAllApartments);
router.get('/:id', apartmentsController.getSingleApartment);

router.post('/', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', description: 'New apartment listing', schema: { $ref: '#/definitions/Apartment' } }
  apartmentsController.createApartment(req, res);
});

router.put('/:id', (req, res) => {
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated apartment listing', schema: { $ref: '#/definitions/Apartment' } }
  apartmentsController.updateApartment(req, res);
});

router.delete('/:id', apartmentsController.deleteApartment);

module.exports = router;
