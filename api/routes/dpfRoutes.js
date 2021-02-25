'use strict';

module.exports = function(app) {
    var dpf = require('../controllers/dpfController');

    app.route('/photos')
    .get(dpf.get_all_photoIDs)
    .post(dpf.new_photo);

    app.route('/photos/:photoID')
    .get(dpf.get_photo)
    .put(dpf.update_photo)
    .delete(dpf.delete_photo);
}