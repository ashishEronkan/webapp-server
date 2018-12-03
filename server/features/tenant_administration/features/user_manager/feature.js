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
 * @class   UserManager
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server UserManager feature - manages tenant feature selection.
 *
 *
 */
class UserManager extends PlantWorksBaseFeature {
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
	 * @memberof Dashboard
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {Object} ctxt - Koa context.
	 *
	 * @returns  {Object} Dashboard display stuff for this Feature.
	 *
	 * @summary  No display in the dashboard itself.
	 */
	async getDashboardDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
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

exports.feature = UserManager;
