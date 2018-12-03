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
 * @class   Profile
 * @extends {PlantWorksBaseFeature}
 * @classdesc The Plant.Works Web Application Server Profile feature - manages user profile updates.
 *
 *
 */
class Profile extends PlantWorksBaseFeature {
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
	 * @memberof Profile
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
			const rbacChecker = this._rbac('registered');
			await rbacChecker(ctxt);

			const defaultDisplay = await super.getDashboardDisplayDetails(ctxt);

			defaultDisplay['attributes']['name'] = `${ctxt.state.user.first_name} ${ctxt.state.user.last_name}`;
			defaultDisplay['attributes']['description'] = `Edit ${ctxt.state.user.first_name}'s Profile Information`;
			defaultDisplay['attributes']['icon_type'] = 'img';
			defaultDisplay['attributes']['icon_path'] = '/profile/get-image';

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

exports.feature = Profile;
