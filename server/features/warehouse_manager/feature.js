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
			const rbacChecker = this._rbac('warehouse-manager-read');
			await rbacChecker(ctxt);

			const defaultDisplay = await super.getDashboardDisplayDetails(ctxt);

			defaultDisplay['attributes']['description'] = `Edit Warehouse Information`;
			defaultDisplay['attributes']['icon_type'] = 'fa';
			defaultDisplay['attributes']['icon_path'] = 'warehouse';

			return defaultDisplay;
		}
		catch(err) {
			return null;
		}
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
