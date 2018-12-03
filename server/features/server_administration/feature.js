'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseFeature = require('plantworks-base-feature').PlantWorksBaseFeature;
// const PlantWorksFeatureError = require('plantworks-feature-error').PlantWorksFeatureError;

/**
 * @class   ServerAdministration
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server ServerAdministration feature - manages server settings.
 *
 *
 */
class ServerAdministration extends PlantWorksBaseFeature {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods - need to be overriden by derived classes
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ServerAdministration
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {Object} ctxt - Koa context.
	 *
	 * @returns  {Object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone logged-in gets access.
	 */
	async getDashboardDisplayDetails(ctxt) {
		const defaultDisplay = await super.getDashboardDisplayDetails(ctxt);

		defaultDisplay['attributes']['description'] = `Edit Server Settings`;
		defaultDisplay['attributes']['icon_type'] = 'mdi';
		defaultDisplay['attributes']['icon_path'] = 'server';

		return null;
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.feature = ServerAdministration;
