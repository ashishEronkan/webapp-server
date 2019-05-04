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
 * @class   WarehouseManager
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server WarehouseManager feature - manages tenant warehouses.
 *
 *
 */
class WarehouseManager extends PlantWorksBaseFeature {
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
	 * @memberof WarehouseManager
	 * @name     getDashboardDisplayDetails
	 *
	 * @param    {Object} ctxt - Koa context.
	 *
	 * @returns  {Object} Dashboard display stuff for this Feature.
	 *
	 * @summary  Everyone logged-in gets access.
	 */
	async getDashboardDisplayDetails(ctxt) {
		try {
			const rbacChecker = this._rbac('warehouse-manager-configuration-read OR warehouse-manager-generate-advice-read OR warehouse-manager-receiving-read OR warehouse-manager-shipping-read');
			await rbacChecker(ctxt);

			return null;
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof WarehouseManager
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {Object} ctxt - Koa context.
	 *
	 * @returns  {Object} Settings display stuff for this Feature.
	 *
	 * @summary  No display in the settings itself.
	 */
	async getSettingsDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
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

exports.feature = WarehouseManager;
