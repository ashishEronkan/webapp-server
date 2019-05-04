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
 * @class   AttributeSets
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSets middleware - manage CRUD for all attribute sets / properties / functions related operations.
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
	 * @memberof AttributeSets
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
					},

					'functions': function() {
						return this.hasMany(self.$AttributeSetFunctionModel, 'attribute_set_id');
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

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetFunctionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_functions',
					'idAttribute': 'attribute_set_function_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

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
	 * @memberof AttributeSets
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$AttributeSetFunctionModel;
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
			await ApiService.add(`${this.name}::createAttributeSet`, this._createAttributeSet.bind(this));
			await ApiService.add(`${this.name}::updateAttributeSet`, this._updateAttributeSet.bind(this));
			await ApiService.add(`${this.name}::deleteAttributeSet`, this._deleteAttributeSet.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::deleteAttributeSet`, this._deleteAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::updateAttributeSet`, this._updateAttributeSet.bind(this));
			await ApiService.remove(`${this.name}::createAttributeSet`, this._createAttributeSet.bind(this));
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
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenantFeature', 'properties', 'functions']
			});

			attributeSetData = this.$jsonApiMapper.map(attributeSetData, 'common/attribute-set', {
				'typeForModel': {
					'tenantFeature': 'tenant-administration/feature-manager/tenant-feature',
					'properties': 'common/attribute-set-property',
					'functions': 'common/attribute-set-function'
				},

				'enableLinks': false
			});

			delete attributeSetData.included;
			return attributeSetData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAttributeSets`, err);
		}
	}

	async _createAttributeSet(ctxt) {
		try {
			const attributeSet = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSet);

			jsonDeserializedData['attribute_set_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSet.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSet.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSet.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSet.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': attributeSet.data.type,
					'id': savedRecord.get('attribute_set_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createAttributeSet`, err);
		}
	}

	async _updateAttributeSet(ctxt) {
		try {
			const attributeSet = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSet);

			jsonDeserializedData['attribute_set_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSet.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSet.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSet.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSet.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': attributeSet.data.type,
					'id': savedRecord.get('attribute_set_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateAttributeSet`, err);
		}
	}

	async _deleteAttributeSet(ctxt) {
		try {
			const attributeSet = await new this.$AttributeSetModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'attribute_set_id': ctxt.params['attributeSetId']
			})
			.fetch();

			if(!attributeSet) throw new Error('Unknown Attribute Set');

			await attributeSet.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteAttributeSet`, err);
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
