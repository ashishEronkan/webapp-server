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
	 * @summary  Access for PUG or User managers, only.
	 */
	async getDashboardDisplayDetails(ctxt) {
		try {
			const rbacChecker = this._rbac('user-manager-read OR group-manager-read');
			await rbacChecker(ctxt);

			const defaultDisplay = await super.getDashboardDisplayDetails(ctxt);

			defaultDisplay['attributes']['name'] = 'Pug';
			defaultDisplay['attributes']['route'] = 'pug';
			defaultDisplay['attributes']['icon_type'] = 'md';
			defaultDisplay['attributes']['icon_path'] = 'group';
			defaultDisplay['attributes']['display_order'] = 'first';

			return defaultDisplay;
		}
		catch(err) {
			return null;
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof TenantAdministration
	 * @name     getSettingsDisplayDetails
	 *
	 * @param    {Object} ctxt - Koa context.
	 *
	 * @returns  {Object} Settings display stuff for this Feature.
	 *
	 * @summary  Access for Tenant Administrators, only.
	 */
	async getSettingsDisplayDetails(ctxt) { // eslint-disable-line no-unused-vars
		try {
			const rbacChecker = this._rbac('tenant-administration-read');
			await rbacChecker(ctxt);

			const settingsDisplay = await super.getSettingsDisplayDetails(ctxt);
			if(!settingsDisplay) return null;

			const basicsDisplay = JSON.parse(JSON.stringify(settingsDisplay));

			basicsDisplay['attributes']['route'] = 'account.basics';
			basicsDisplay['attributes']['icon_type'] = 'md';
			basicsDisplay['attributes']['icon_path'] = 'account_circle';
			basicsDisplay['attributes']['display_order'] = 'first';

			return [basicsDisplay];
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
