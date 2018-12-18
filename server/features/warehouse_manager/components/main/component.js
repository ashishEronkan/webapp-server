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
 * @class   Main
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Main component of the Warehouse Manager Feature - manages CRUD for the warehouses.
 *
 *
 */
class Main extends PlantWorksBaseComponent {
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
	 * @memberof Main
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/warehouses', this.$parent._rbac('warehouse-manager-configuration-read OR warehouse-manager-generate-advice-read OR warehouse-manager-receiving-read OR warehouse-manager-shipping-read'), this._getAllWarehouses.bind(this));

			this.$router.get('/warehouses/:tenant_warehouse_id', this.$parent._rbac('warehouse-manager-configuration-read'), this._getWarehouse.bind(this));
			this.$router.post('/warehouses', this.$parent._rbac('warehouse-manager-configuration-update'), this._addWarehouse.bind(this));
			this.$router.del('/warehouses/:tenant_warehouse_id', this.$parent._rbac('warehouse-manager-configuration-update'), this._deleteWarehouse.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAllWarehouses(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const warehouseData = await apiSrvc.execute('Main::getAllWarehouses', ctxt);

			ctxt.status = 200;
			ctxt.body = warehouseData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving Warehouse data`, err);
		}
	}

	async _getWarehouse(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const warehouseData = await apiSrvc.execute('Main::getWarehouse', ctxt);

			ctxt.status = 200;
			ctxt.body = warehouseData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving Warehouse data`, err);
		}
	}

	async _addWarehouse(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const warehouseData = await apiSrvc.execute('Main::addWarehouse', [ctxt, true]);

			ctxt.status = 200;
			ctxt.body = warehouseData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding Warehouse`, err);
		}
	}

	async _deleteWarehouse(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteWarehouse', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting Warehouse`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['ApiService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Main;
