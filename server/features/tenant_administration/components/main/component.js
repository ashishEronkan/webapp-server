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
 * @classdesc The Main component of the Tenant Administration Feature - manages CRUD for the account.
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
			this.$router.get('/tenants/:tenant_id', this.$parent._rbac('tenant-administration-read'), this._getTenant.bind(this));
			this.$router.patch('/tenants/:tenant_id', this.$parent._rbac('tenant-administration-update'), this._updateTenant.bind(this));
			this.$router.del('/tenants/:tenant_id', this.$parent._rbac('tenant-administration-all'), this._deleteTenant.bind(this));

			this.$router.get('/tenant-locations/:tenant_location_id', this.$parent._rbac('tenant-administration-read'), this._getLocation.bind(this));
			this.$router.post('/tenant-locations', this.$parent._rbac('tenant-administration-update'), this._addLocation.bind(this));
			this.$router.patch('/tenant-locations/:tenant_location_id', this.$parent._rbac('tenant-administration-update'), this._updateLocation.bind(this));
			this.$router.del('/tenant-locations/:tenant_location_id', this.$parent._rbac('tenant-administration-update'), this._deleteLocation.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getTenant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantData = await apiSrvc.execute('Main::getTenant', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant data`, err);
		}
	}

	async _updateTenant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantData = await apiSrvc.execute('Main::updateTenant', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant data`, err);
		}
	}

	async _deleteTenant(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenant', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant`, err);
		}
	}

	async _getLocation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const locationData = await apiSrvc.execute('Main::getLocation', ctxt);

			ctxt.status = 200;
			ctxt.body = locationData.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving location`, err);
		}
	}

	async _addLocation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::addLocation', [ctxt, true]);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error adding location`, err);
		}
	}

	async _updateLocation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::addLocation', [ctxt, false]);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating location`, err);
		}
	}

	async _deleteLocation(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteLocation', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting location`, err);
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
