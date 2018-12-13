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
 * @classdesc The Plant.Works Web Application Server SKU Manager Feature Main middleware - manages CRUD for account data.
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

			Object.defineProperty(this, '$TenantModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants',
					'idAttribute': 'tenant_id',
					'hasTimestamps': true,

					'skus': function() {
						return this.hasMany(self.$TenantSkuModel, 'tenant_id', 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantSkuModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_skus',
					'idAttribute': 'tenant_sku_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id', 'tenant_id');
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
			delete this.$TenantModel;
			delete this.$TenantSkuModel;

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

			await ApiService.add(`${this.name}::getAllSkus`, this._getAllSkus.bind(this));
			await ApiService.add(`${this.name}::getSku`, this._getSku.bind(this));
			await ApiService.add(`${this.name}::addSku`, this._addSku.bind(this));
			await ApiService.add(`${this.name}::deleteSku`, this._deleteSku.bind(this));

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

			await ApiService.remove(`${this.name}::deleteSku`, this._deleteSku.bind(this));
			await ApiService.remove(`${this.name}::addSku`, this._addSku.bind(this));
			await ApiService.remove(`${this.name}::getSku`, this._getSku.bind(this));
			await ApiService.remove(`${this.name}::getAllSkus`, this._getAllSkus.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAllSkus(ctxt) {
		try {
			const SkuRecord = new this.$TenantSkuModel({
				'tenant_id': ctxt.state.tenant.tenant_id
			});

			let skuData = await SkuRecord.fetchAll({
				'withRelated': ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); })
			});

			skuData = this.$jsonApiMapper.map(skuData, 'sku-manager/sku', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant'
				},

				'enableLinks': false
			});

			return skuData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllSkus`, err);
		}
	}

	async _getSku(ctxt) {
		try {
			const SkuRecord = new this.$TenantSkuModel({
				'tenant_id': ctxt.state.tenant.tenant_id,
				'tenant_sku_id': ctxt.params['tenant_sku_id']
			});

			let skuData = await SkuRecord.fetch({
				'withRelated': ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); })
			});

			skuData = this.$jsonApiMapper.map(skuData, 'sku-manager/sku', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant'
				},

				'enableLinks': false
			});

			return skuData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getSku`, err);
		}
	}

	async _addSku(ctxt, insert) {
		try {
			const tenantSku = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantSku);
			jsonDeserializedData['tenant_sku_id'] = jsonDeserializedData.id;

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantSku.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantSku.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantSku.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantSku.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$TenantSkuModel
				.forge()
				.save(jsonDeserializedData, {
					'method': insert ? 'insert' : 'update',
					'patch': !insert
				});

			return {
				'data': {
					'type': tenantSku.data.type,
					'id': savedRecord.get('tenant_sku_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addSku`, err);
		}
	}

	async _deleteSku(ctxt) {
		try {
			await new this.$TenantSkuModel({
				'tenant_id': ctxt.state.tenant.tenant_id,
				'tenant_sku_id': ctxt.params['tenant_sku_id']
			})
			.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteSku`, err);
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
