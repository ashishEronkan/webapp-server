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
 * @class   AttributeSetProperties
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server AttributeSetProperties middleware - manage CRUD for all attribute sets / properties related operations.
 *
 *
 */
class AttributeSetProperties extends PlantWorksBaseMiddleware {
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
	 * @memberof AttributeSetProperties
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
	 * @memberof AttributeSetProperties
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

			await ApiService.add(`${this.name}::getAttributeSetProperty`, this._getAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::createAttributeSetProperty`, this._createAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::updateAttributeSetProperty`, this._updateAttributeSetProperty.bind(this));
			await ApiService.add(`${this.name}::deleteAttributeSetProperty`, this._deleteAttributeSetProperty.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::deleteAttributeSetProperty`, this._deleteAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::updateAttributeSetProperty`, this._updateAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::createAttributeSetProperty`, this._createAttributeSetProperty.bind(this));
			await ApiService.remove(`${this.name}::getAttributeSetProperty`, this._getAttributeSetProperty.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAttributeSetProperty(ctxt) {
		try {
			let attributeSetPropertyData = await this.$AttributeSetPropertyModel
			.query(function(qb) {
				qb
				.where('attribute_set_property_id', '=', ctxt.params['attributeSetPropertyId'])
				.andWhere({ 'tenant_id': ctxt.state.tenant.tenant_id });
			})
			.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((related) => { return related.trim(); }) : ['tenant', 'attributeSet']
			});

			attributeSetPropertyData = this.$jsonApiMapper.map(attributeSetPropertyData, 'common/attribute-set-property', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'attributeSet': 'common/attribute-set'
				},

				'enableLinks': false
			});

			delete attributeSetPropertyData.included;
			return attributeSetPropertyData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAttributeSetProperty`, err);
		}
	}

	async _createAttributeSetProperty(ctxt) {
		try {
			const attributeSetProperty = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSetProperty);

			jsonDeserializedData['attribute_set_property_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSetProperty.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSetProperty.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSetProperty.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSetProperty.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': attributeSetProperty.data.type,
					'id': savedRecord.get('attribute_set_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_createAttributeSetProperty`, err);
		}
	}

	async _updateAttributeSetProperty(ctxt) {
		try {
			const attributeSetProperty = ctxt.request.body;
			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(attributeSetProperty);

			jsonDeserializedData['attribute_set_property_id'] = jsonDeserializedData['id'];
			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(attributeSetProperty.data.relationships || {}).forEach((relationshipName) => {
				if(!attributeSetProperty.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!attributeSetProperty.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = attributeSetProperty.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$AttributeSetPropertyModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': attributeSetProperty.data.type,
					'id': savedRecord.get('attribute_set_property_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateAttributeSetProperty`, err);
		}
	}

	async _deleteAttributeSetProperty(ctxt) {
		try {
			const attributeSetProperty = await new this.$AttributeSetPropertyModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'attribute_set_property_id': ctxt.params['attributeSetPropertyId']
			})
			.fetch();

			if(!attributeSetProperty) throw new Error('Unknown Attribute Set Property');

			await attributeSetProperty.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteAttributeSetProperty`, err);
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

exports.middleware = AttributeSetProperties;
