/* eslint-disable security/detect-object-injection */

'use strict';

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseMiddleware = require('plantworks-base-middleware').PlantWorksBaseMiddleware;
const PlantWorksMiddlewareError = require('plantworks-middleware-error').PlantWorksMiddlewareError;

/**
 * @class   Main
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Tenant Administration Feature Main middleware - manages CRUD for account data.
 *
 *
 */
class Main extends PlantWorksBaseMiddleware {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region startup/teardown code
	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ApiService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up the broker to manage API exposed by other modules.
	 */
	async _setup() {
		try {
			await super._setup();

			const dbSrvc = this.$dependencies.DatabaseService;
			const self = this; // eslint-disable-line consistent-this

			Object.defineProperty(this, '$FeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'modules',
					'idAttribute': 'module_id',
					'hasTimestamps': true,

					'parent': function() {
						return this.belongsTo(self.$FeatureModel, 'parent_module_id');
					},

					'modules': function() {
						return this.hasMany(self.$FeatureModel, 'parent_module_id');
					},

					'permissions': function() {
						return this.hasMany(self.$FeaturePermissionModel, 'module_id');
					},

					'tenant_features': function() {
						return this.hasMany(self.$TenantFeatureModel, 'module_id');
					}
				})
			});

			Object.defineProperty(this, '$FeaturePermissionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'feature_permissions',
					'idAttribute': 'feature_permission_id',
					'hasTimestamps': true,

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'idAttribute': 'tenant_id',
					'hasTimestamps': true,

					'tenant_features': function() {
						return this.hasMany(self.$TenantFeatureModel, 'module_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_features',
					'idAttribute': 'tenant_feature_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					}
				})
			});

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof ApiService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$TenantFeatureModel;
			delete this.$TenantModel;
			delete this.$FeaturePermissionModel;
			delete this.$FeatureModel;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.add(`${this.name}::getModuleTree`, this._getModuleTree.bind(this));
			await ApiService.add(`${this.name}::getModule`, this._getModule.bind(this));
			await ApiService.add(`${this.name}::getModulePermission`, this._getModulePermission.bind(this));

			await super._registerApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::getModulePermission`, this._getModulePermission.bind(this));
			await ApiService.remove(`${this.name}::getModule`, this._getModule.bind(this));
			await ApiService.remove(`${this.name}::getModuleTree`, this._getModuleTree.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getModuleTree(ctxt) {
		try {
			let serverModule = this.$parent;
			while(serverModule.$parent) serverModule = serverModule.$parent;

			const configSrvc = this.$dependencies.ConfigurationService;
			const serverModuleId = await configSrvc.getModuleID(serverModule);

			let query = `SELECT module_id AS id, COALESCE(CAST(parent_module_id AS text), '#') AS parent, name AS text FROM modules WHERE module_id IN (SELECT module_id FROM fn_get_module_descendants(?) WHERE (module_type = 'server' OR module_type = 'feature'))`;
			if(ctxt.state.tenant['sub_domain'] !== 'www') query += ` AND deploy <> 'admin'`;

			const dbSrvc = this.$dependencies.DatabaseService;
			const serverFeatures = await dbSrvc.knex.raw(query, [serverModuleId]);

			return serverFeatures.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getModuleTree`, err);
		}
	}

	async _getModule(ctxt) {
		try {
			const ModuleRecord = new this.$FeatureModel({
				'module_id': ctxt.params.feature_id
			});

			let moduleData = await ModuleRecord.fetch({
				'withRelated': ['parent', 'permissions', 'modules', 'tenant_features']
			});

			moduleData = this.$jsonApiMapper.map(moduleData, 'server_administration/features', {
				'typeForModel': {
					'parent': 'server_administration/features',
					'permissions': 'server_administration/feature_permissions',
					'modules': 'server_administration/features',
					'tenant_features': 'tenant_administration/feature_manager/tenant_feature'
				},

				'enableLinks': false
			});

			moduleData.included = moduleData.included.filter((inclData) => {
				return inclData['type'] === 'server_administration/feature_permissions';
			});

			moduleData.data.relationships.features = JSON.parse(JSON.stringify(moduleData.data.relationships.modules));
			return moduleData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getModule`, err);
		}
	}

	async _getModulePermission(ctxt) {
		try {
			const ModulePermissionRecord = new this.$FeaturePermissionModel({
				'feature_permission_id': ctxt.params.feature_permission_id
			});

			let modulePermissionData = await ModulePermissionRecord.fetch({
				'withRelated': ['feature']
			});

			modulePermissionData = this.$jsonApiMapper.map(modulePermissionData, 'server_administration/feature-permission', {
				'typeForModel': {
					'feature': 'server_administration/feature'
				},

				'enableLinks': false
			});

			delete modulePermissionData.included;
			return modulePermissionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getModulePermission`, err);
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

exports.middleware = Main;
