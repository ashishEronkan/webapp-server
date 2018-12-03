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
 * @class   Session
 * @extends {PlantWorksBaseMiddleware}
 * @classdesc The Plant.Works Web Application Server Session middleware - manages reset password and related operations.
 *
 *
 */
class Session extends PlantWorksBaseMiddleware {
	// #region Constructor
	constructor(parent, loader) {
		super(parent, loader);
	}
	// #endregion

	// #region Protected methods
	async _registerApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await super._registerApis();
			await ApiService.add(`${this.name}::resetPassword`, this._resetPassword.bind(this));

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}

	async _deregisterApis() {
		try {
			const ApiService = this.$dependencies.ApiService;

			await ApiService.remove(`${this.name}::resetPassword`, this._resetPassword.bind(this));
			await super._deregisterApis();

			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_registerApis`, err);
		}
	}
	// #endregion

	// #region API
	async _resetPassword(ctxt) {
		const uuid = require('uuid/v4');
		const upash = require('upash');
		// Not required here - apparently, once installed anywhere, we're good to go
		// upash.install('pbkdf2', require('@phc/pbkdf2'));

		const username = ctxt.request.body.username;
		const dbSrvc = this.$dependencies.DatabaseService;

		const userId = await dbSrvc.knex.raw(`SELECT user_id FROM users WHERE email = ?`, [username]);
		if(!userId.rows.length) throw new PlantWorksMiddlewareError(`Invalid Email: ${username}`);

		let rawPassword = '';
		try {
			const RandomOrg = require('random-org');
			const random = new RandomOrg(this.$config.randomServer);

			const randomPasswordResponse = await random.generateStrings(this.$config.passwordFormat);
			rawPassword = randomPasswordResponse.random.data.pop();
		}
		catch(err) {
			rawPassword = uuid().toString();
		}

		const hashedPassword = await upash.hash(rawPassword);

		await dbSrvc.knex.raw(`UPDATE users SET password = ? WHERE email = ?`, [hashedPassword, username]);

		const messageOptions = JSON.parse(JSON.stringify(this.$config.resetPasswordMail));
		messageOptions['to'] = username;
		messageOptions['text'] = `Your auto-generated password on Plant.Works is ${rawPassword}`;

		const mailerSrvc = this.$dependencies.MailerService;
		const sendMailResult = await mailerSrvc.sendMail(messageOptions);

		if(plantworksEnv === 'development' || plantworksEnv === 'test') console.log(`Message Options: ${JSON.stringify(messageOptions, null, '\t')}\nSend Mail Result: ${JSON.stringify(sendMailResult, null, '\t')}`);
		return true;
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get dependencies() {
		return ['MailerService'].concat(super.dependencies);
	}
	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.middleware = Session;
