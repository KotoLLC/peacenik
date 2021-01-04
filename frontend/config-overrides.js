const rewireAliases = require('react-app-rewire-aliases');
const { paths } = require('react-app-rewired');
const path = require('path');

module.exports = function override(config, env) {
	config = rewireAliases.aliasesOptions({
		'@view': path.resolve(__dirname, `${paths.appSrc}/view/`),
		'@store': path.resolve(__dirname, `${paths.appSrc}/store/`),
		'@sagas': path.resolve(__dirname, `${paths.appSrc}/sagas/`),
		'@services': path.resolve(__dirname, `${paths.appSrc}/services/`),
		'@selectors': path.resolve(__dirname, `${paths.appSrc}/selectors/`),
		'@assets': path.resolve(__dirname, `${paths.appSrc}/assets/`),
	})(config, env);
	return config;
};
