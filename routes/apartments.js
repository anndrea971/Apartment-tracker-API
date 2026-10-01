const router = require('express').Router();
const apartmentsController = require('../controllers/apartments');
const ensureAuthenticated = require('../middleware/ensureAuth');

router.get('/', apartmentsController.getAllApartments);
router.get('/:id', apartmentsController.getSingleApartment);

router.post('/', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', description: 'New apartment listing', schema: { $ref: '#/definitions/Apartment' } }
  apartmentsController.createApartment(req, res);
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  // #swagger.parameters['body'] = { in: 'body', description: 'Updated apartment listing', schema: { $ref: '#/definitions/Apartment' } }
  apartmentsController.updateApartment(req, res);
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  // #swagger.security = [{ "cookieAuth": [] }]
  apartmentsController.deleteApartment(req, res);
});

module.exports = router;
