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
 * @class   AttributeSetFunctions
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSetFunctions middleware - manage CRUD for all attribute sets / functions related operations.
 *
 *
 */
class AttributeSetFunctions extends PlantWorksBaseMiddleware {
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
	 * @memberof AttributeSetFunctions
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
					},

					'dependantFunctions': function() {
						return this.hasMany(self.$AttributeSetFunctionObservedPropertyModel, 'attribute_set_property_id');
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
					},

					'observedProperties': function() {
						return this.hasMany(self.$AttributeSetFunctionObservedPropertyModel, 'attribute_set_function_id');
					}
				})
			});

			Object.defineProperty(this, '$AttributeSetFunctionObservedPropertyModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'attribute_set_function_observed_properties',
					'idAttribute': 'attribute_set_function_observed_property_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'attributeSet': function() {
						return this.belongsTo(self.$AttributeSetModel, 'attribute_set_id');
					},

					'attributeSetFunction': function() {
						return this.belongsTo(self.$AttributeSetFunctionModel, 'attribute_set_function_id');
					},

					'attributeSetProperty': function() {
						return this.belongsTo(self.$AttributeSetPropertyModel, 'attribute_set_property_id');
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
	 * @memberof AttributeSetFunctions
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Deletes the broker that manages API.
	 */
	async _teardown() {
		try {
			delete this.$AttributeSetFunctionObservedPropertyModel;
			delete this.$AttributeSetFunctionModel;
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

			await ApiService.add(`${this.name}::getAttributeSetFunction`, this._getAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::createAttributeSetFunction`, this._createAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::updateAttributeSetFunction`, this._updateAttributeSetFunction.bind(this));
			await ApiService.add(`${this.name}::deleteAttributeSetFunction`, this._deleteAttributeSetFunction.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::deleteAttributeSetFunction`, this._deleteAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::updateAttributeSetFunction`, this._updateAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::createAttributeSetFunction`, this._createAttributeSetFunction.bind(this));
			await ApiService.remove(`${this.name}::getAttributeSetFunction`, this._getAttributeSetFunction.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAttributeSetFunction(ctxt) {
		try {
			let attributeSetFunctionData = await this.$AttributeSetFunctionModel
			.query(function(qb) {
				qb
				.where('attribute_set_function_id', '=', ctxt.params['attributeSetFunctionId'])
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet', 'observedProperties']
			});

			attributeSetFunctionData = this.$jsonApiMapper.map(attributeSetFunctionData, 'common/attribute-set-function', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'attributeSet': 'common/attribute-set',
					'observedProperties': 'common/attribute-set-function-observed-property'
				},

				'enableLinks': false
			});

			delete attributeSetFunctionData.included;
			return attributeSetFunctionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAttributeSetFunction`, err);
		}
	}

	async _createAttributeSetFunction(ctxt) {
		try {
			const attributeSetFunction = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSetFunction);

			jsonDeserializedData['attribute_set_function_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSetFunction.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSetFunction.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSetFunction.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSetFunction.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': attributeSetFunction.data.type,
					'id': savedRecord.get('attribute_set_function_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createAttributeSetFunction`, err);
		}
	}

	async _updateAttributeSetFunction(ctxt) {
		try {
			const attributeSetFunction = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSetFunction);

			jsonDeserializedData['attribute_set_function_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSetFunction.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSetFunction.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSetFunction.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSetFunction.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetFunctionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': attributeSetFunction.data.type,
					'id': savedRecord.get('attribute_set_function_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateAttributeSetFunction`, err);
		}
	}

	async _deleteAttributeSetFunction(ctxt) {
		try {
			const attributeSetFunction = await new this.$AttributeSetFunctionModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'attribute_set_function_id': ctxt.params['attributeSetFunctionId']
			})
			.fetch();

			if(!attributeSetFunction) throw new Error('Unknown Attribute Set Function');

			await attributeSetFunction.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteAttributeSetFunction`, err);
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

exports.middleware = AttributeSetFunctions;
