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
 * @classdesc The Plant.Works Web Application Server Warehouse Manager Feature Main middleware - manages CRUD for account data.
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

					'warehouses': function() {
						return this.hasMany(self.$TenantWarehouseModel, 'tenant_id', 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantWarehouseModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_warehouses',
					'idAttribute': 'tenant_warehouse_id',
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
			delete this.$TenantWarehouseModel;

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

			await ApiService.add(`${this.name}::getAllWarehouses`, this._getAllWarehouses.bind(this));
			await ApiService.add(`${this.name}::getWarehouse`, this._getWarehouse.bind(this));
			await ApiService.add(`${this.name}::addWarehouse`, this._addWarehouse.bind(this));
			await ApiService.add(`${this.name}::deleteWarehouse`, this._deleteWarehouse.bind(this));

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

			await ApiService.remove(`${this.name}::deleteWarehouse`, this._deleteWarehouse.bind(this));
			await ApiService.remove(`${this.name}::addWarehouse`, this._addWarehouse.bind(this));
			await ApiService.remove(`${this.name}::getWarehouse`, this._getWarehouse.bind(this));
			await ApiService.remove(`${this.name}::getAllWarehouses`, this._getAllWarehouses.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getAllWarehouses(ctxt) {
		try {
			const WarehouseRecord = new this.$TenantWarehouseModel({
				'tenant_id': ctxt.state.tenant.tenant_id
			});

			let warehouseData = await WarehouseRecord.fetchAll({
				'withRelated': ctxt.query.include ? ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); }) : ['tenant']
			});

			warehouseData = this.$jsonApiMapper.map(warehouseData, 'warehouse-manager/warehouse', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant'
				},

				'enableLinks': false
			});

			return warehouseData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getAllWarehouses`, err);
		}
	}

	async _getWarehouse(ctxt) {
		try {
			const WarehouseRecord = new this.$TenantWarehouseModel({
				'tenant_id': ctxt.state.tenant.tenant_id,
				'tenant_warehouse_id': ctxt.params['tenant_warehouse_id']
			});

			let warehouseData = await WarehouseRecord.fetch({
				'withRelated': ctxt.query.include ? ctxt.query.include.split(',').map((inclRsrc) => { return inclRsrc.trim(); }) : ['tenant']
			});

			warehouseData = this.$jsonApiMapper.map(warehouseData, 'warehouse-manager/warehouse', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant'
				},

				'enableLinks': false
			});

			return warehouseData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getWarehouse`, err);
		}
	}

	async _addWarehouse(ctxt, insert) {
		try {
			const tenantWarehouse = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantWarehouse);
			jsonDeserializedData['tenant_warehouse_id'] = jsonDeserializedData.id;

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantWarehouse.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantWarehouse.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantWarehouse.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantWarehouse.data.relationships[relationshipName].data.id;
			});

			const savedRecord = await this.$TenantWarehouseModel
				.forge()
				.save(jsonDeserializedData, {
					'method': insert ? 'insert' : 'update',
					'patch': !insert
				});

			return {
				'data': {
					'type': tenantWarehouse.data.type,
					'id': savedRecord.get('tenant_warehouse_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addWarehouse`, err);
		}
	}

	async _deleteWarehouse(ctxt) {
		try {
			await new this.$TenantWarehouseModel({
				'tenant_id': ctxt.state.tenant.tenant_id,
				'tenant_warehouse_id': ctxt.params['tenant_warehouse_id']
			})
			.destroy();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteWarehouse`, err);
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
