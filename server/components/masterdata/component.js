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
			this.$router.get('/attributeSourceTypes', this._getAttributeSourceTypes.bind(this));
			this.$router.get('/attributeDataTypes', this._getAttributeDataTypes.bind(this));
			this.$router.get('/timestampFormatTypes', this._getTimestampTypes.bind(this));
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
	async _getAttributeSourceTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const sourceTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::attribute_source_type)) AS source_type');

		const responseData = [];
		sourceTypes.rows.forEach((sourceTypeData) => {
			responseData.push(sourceTypeData['source_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getAttributeDataTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const valueTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::attribute_value_type)) AS value_type');

		const responseData = [];
		valueTypes.rows.forEach((valueTypeData) => {
			responseData.push(valueTypeData['value_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

	async _getTimestampTypes(ctxt) {
		if(!ctxt.state.user) throw new Error('This information is available only to logged-in Users');

		const dbSrvc = this.$dependencies.DatabaseService;
		const timestampTypes = await dbSrvc.knex.raw('SELECT unnest(enum_range(NULL::timestamp_type)) AS timestamp_type');

		const responseData = [];
		timestampTypes.rows.forEach((timestampTypeData) => {
			responseData.push(timestampTypeData['timestamp_type']);
		});

		ctxt.status = 200;
		ctxt.body = responseData;
	}

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
