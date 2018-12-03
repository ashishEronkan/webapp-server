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
const PlantWorksCompError = require('plantworks-component-error').PlantWorksComponentError;

/**
 * @class   Masterdata
 * @extends {PlantWorksBaseComponent}
 * @classdesc The Plant.Works Web Application Server Masterdata component - exposes a read-only view of the master data in Plant.Works.
 *
 *
 */
class Masterdata extends PlantWorksBaseComponent {
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
	 * @memberof Masterdata
	 * @name     _addRoutes
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Adds routes to the Koa Router.
	 */
	async _addRoutes() {
		try {
			this.$router.get('/contactTypes', this._getContactTypes.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksCompError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _getContactTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const contactTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::contact_type)) AS contact_types');

		const responseData = [];
		contactTypes.rows.forEach((contactTypeData) => {
			responseData.push(contactTypeData.contact_types);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['DatabaseService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.component = Masterdata;
