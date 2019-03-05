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
 * @classdesc The Main component of the SKU Manager Feature - manages CRUD for the skus.
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
			this.$router.get('/skus', this.$parent._rbac('sku-manager-attribute-set-read OR sku-manager-configuration-read OR sku-manager-upload OR sku-manager-report-execute'), this._getAllSkus.bind(this));

			this.$router.get('/skus/:tenant_sku_id', this.$parent._rbac('sku-manager-configuration-read'), this._getSku.bind(this));
			this.$router.post('/skus', this.$parent._rbac('sku-manager-configuration-update'), this._addSku.bind(this));
			this.$router.del('/skus/:tenant_sku_id', this.$parent._rbac('sku-manager-configuration-update'), this._deleteSku.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getAllSkus(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const skuData = await apiSrvc.execute('Main::getAllSkus', ctxt);

			ctxt.status = 200;
			ctxt.body = skuData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving SKU data`, err);
		}
	}

	async _getSku(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const skuData = await apiSrvc.execute('Main::getSku', ctxt);

			ctxt.status = 200;
			ctxt.body = skuData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving SKU data`, err);
		}
	}

	async _addSku(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const skuData = await apiSrvc.execute('Main::addSku', [ctxt, true]);

			ctxt.status = 200;
			ctxt.body = skuData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding SKU`, err);
		}
	}

	async _deleteSku(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteSku', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting SKU`, err);
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
