/**
 * Change variables here
 * Download the .pem certificate for you device and add it to the 'cert' folder (it should be named: 'device_certificate.pem').
 * Add the secret that was generated when creating the .pem certificate to the 'certificate-secret.txt' file.
 */
exports.device      = 'DEVICE_HTF_USER_XX',
exports.sensorAltId = 'SENSOR_HTF_USER_XX',
exports.capAltId    = 'CAP_HTF20',
exports.deviceId    = '',
exports.userName    = '',
exports.password    = '';
exports.cert        = './config/device_certificate.pem',
exports.secret      = './config/certificate-secret.txt',
exports.topic       = 'measures/' + exports.device,
exports.baseUrl     = 'https://' + exports.userName + ':' + exports.password + '@flexso.eu10.cp.iot.sap',
exports.measuresUrl = exports.baseUrl + '/iot/core/api/v1/tenant/2/devices/' + exports.deviceId + '/measures';