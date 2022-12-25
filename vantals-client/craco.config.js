const path = require('path');
const jp = require('jsonpath');

module.exports = {
	webpack: {
		configure: (webpackConfig, { env, paths }) => {
			let setting = jp.query(webpackConfig, '$.module.rules[*].oneOf[?(@.include)]')[0];
			setting.include = [
				setting.include, 
				path.resolve(__dirname, '../vantals-common/src')
			];
			return webpackConfig;
		  }
	}
};