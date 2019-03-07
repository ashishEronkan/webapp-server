'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseComponent = require('plantworks-base-component').PlantWorksBaseComponent;
const PlantWorksComponentError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   AttributeSets
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server AttributeSet component - exposes attribute set management.
 *
 *
 */
class AttributeSets extends PlantWorksBaseComponent {
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
	 * @memberof AttributeSet
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/tenantFeatureIdFromName/:featureName', this.$parent._rbac('registered'), this._getTenantFeatureId.bind(this));
			this.$router.get('/', this.$parent._rbac('registered'), this._getAttributeSets.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTenantFeatureId(ctxt) {
		let serverModule = this.$parent;
		while(serverModule.$parent) serverModule = serverModule.$parent;

		const configSrvc = this.$dependencies.ConfigurationService;
		const serverModuleId = await configSrvc.getModuleID(serverModule);

		const dbSrvc = this.$dependencies.DatabaseService;
		const tenantFeatureId = await dbSrvc.knex.raw('SELECT tenant_feature_id FROM tenants_features WHERE tenant_id = ? AND module_id = (SELECT module_id FROM fn_get_module_descendants(?) WHERE name = ?)', [ctxt.state.tenant.tenant_id, serverModuleId, ctxt.params.featureName]);

		ctxt.status = 200;
		ctxt.body = { 'tenantFeatureId': tenantFeatureId.rows[0]['tenant_feature_id'] };
	}

	async _getAttributeSets(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const attributeSetData = await apiSrvc.execute('AttributeSets::getAttributeSets', ctxt);

			ctxt.status = 200;
			ctxt.body = attributeSetData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving attribute set data`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = AttributeSets;
