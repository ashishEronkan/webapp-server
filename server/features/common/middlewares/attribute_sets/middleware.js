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
 * @class   AttributeSets
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSets middleware - manage CRUD for all attribute sets / properties related operations.
 *
 *
 */
class AttributeSets extends PlantWorksBaseMiddleware {
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

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'idAttribute': 'tenant_id',
					'hasTimestamps': true,

					'tenantFeatures': function() {
						return this.hasMany(self.$TenantFeatureModel, 'tenant_id');
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

					'attributeSets': function() {
						return this.hasMany(self.$AttributeSetModel, 'tenant_feature_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_sets',
					'idAttribute': 'attribute_set_id',
					'hasTimestamps': true,

					'tenantFeature': function() {
						return this.belongsTo(self.$TenantFeatureModel, 'tenant_feature_id');
					},

					'properties': function() {
						return this.hasMany(self.$AttributeSetPropertyModel, 'attribute_set_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_properties',
					'idAttribute': 'attribute_set_property_id',
					'hasTimestamps': true,

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
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
			delete this.$AttributeSetPropertyModel;
			delete this.$AttributeSetModel;
			delete this.$TenantFeatureModel;
			delete this.$TenantModel;

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

			await super._registerApis();
			await ApiService.add(`${this.name}::getAttributeSets`, this._getAttributeSets.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::getAttributeSets`, this._getAttributeSets.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAttributeSets(ctxt) {
		try {
			let attributeSetData = await this.$AttributeSetModel
			.query(function(qb) {
				qb
				.where('tenant_feature_id', '=', ctxt.query['tenant-feature-id'])
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetchAll({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'properties']
			});

			attributeSetData = this.$jsonApiMapper.map(attributeSetData, 'common/attribute-set', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'properties': 'common/attribute-set-property'
				},

				'enableLinks': false
			});

			return attributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantUser`, err);
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

exports.middleware = AttributeSets;
