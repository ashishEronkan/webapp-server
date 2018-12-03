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
 * @class   TenantAdministration
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server TenantAdministration feature - manages tenant settings.
 *
 *
 */
class TenantAdministration extends PlantWorksBaseFeature {
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
	 * @memberof TenantAdministration
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
			const rbacChecker = this._rbac('tenant-administration-read');
			await rbacChecker(ctxt);

			const defaultDisplay = await super.getDashboardDisplayDetails(ctxt);

			defaultDisplay['attributes']['description'] = `Edit Account Settings`;
			defaultDisplay['attributes']['icon_type'] = 'mdi';
			defaultDisplay['attributes']['icon_path'] = 'account-settings';

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

exports.feature = TenantAdministration;
