'use strict';

/* eslint-disable security/detect-object-injection */
/* eslint-disable security/detect-non-literal-require */

/**
 * Module dependencies, required for ALL Plant.Works' modules
 * @ignore
 */

/**
 * Module dependencies, required for this module
 * @ignore
 */
const PlantWorksBaseService = require('plantworks-base-service').PlantWorksBaseService;
const PlantWorksSrvcError = require('plantworks-service-error').PlantWorksServiceError;

/**
 * @class   PubsubService
 * @extends {PlantWorksBaseService}
 * @classdesc The Plant.Works Web Application Server Publish/Subscribe Service.
 *
 * @description
 * Allows the rest of the Plant.Works Modules to use publish / subscribe to topics.
 *
 */
class PubsubService extends PlantWorksBaseService {
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
	 * @memberof PubsubService
	 * @name     _setup
	 *
	 * @returns  {null} Nothing.
	 *
	 * @summary  Sets up connections to the messaging servers.
	 */
	async _setup() {
		try {
			await super._setup();

			this.$listeners = {};

			const promises = require('bluebird');
			const ascoltatori = promises.promisifyAll(require('ascoltatori'));

			const pubsubStrategies = Object.keys(this.$config);
			for(const pubsubStrategy of pubsubStrategies) {
				const buildSettings = JSON.parse(JSON.stringify(this.$config[pubsubStrategy]));

				if(buildSettings.type === 'amqplib') {
					buildSettings['amqp'] = require(buildSettings[buildSettings.type]);
					delete buildSettings[buildSettings.type];
				}
				else {
					buildSettings[buildSettings.type] = require(buildSettings[buildSettings.type]);
				}

				const connection = await ascoltatori.buildAsync(buildSettings);
				this.$listeners[pubsubStrategy] = promises.promisifyAll(connection);
			}

			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_setup error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @override
	 * @instance
	 * @memberof PubsubService
	 * @name     _teardown
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Quits the connection to the messaging servers.
	 */
	async _teardown() {
		try {
			const pubsubStrategies = Object.keys(this.$config);

			// eslint-disable-next-line curly
			for(const pubsubStrategy of pubsubStrategies) {
				await this.$listeners[pubsubStrategy].closeAsync();
			}

			this.$listeners = null;
			delete this.$listeners;

			await super._teardown();
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::_teardown error`, err);
		}
	}
	// #endregion

	// #region API
	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PubsubService
	 * @name     publish
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to publish on.
	 * @param    {Object} data - The data to publish.
	 * @param    {Object} [options] - Additional options, if any.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Publishes data to the specified queues.
	 */
	async publish(strategy, topic, data, options) {
		try {
			let publishCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for(const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				await this.$listeners[pubsubStrategy].publishAsync(topic, data, options);
				publishCount++;
			}

			if(!publishCount) throw new Error(`Unknown Strategy: ${strategy}`);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::publish error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PubsubService
	 * @name     subscribe
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to subscribe to.
	 * @param    {Function} listener - The callback to invoke when data is received.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Subscribes the listener to the specified queues.
	 */
	async subscribe(strategy, topic, listener) {
		try {
			let subscribeCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for(const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				await this.$listeners[pubsubStrategy].subscribeAsync(topic, listener);
				subscribeCount++;
			}

			if(!subscribeCount) throw new Error(`Unknown Strategy: ${strategy}`);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::subscribe error`, err);
		}
	}

	/**
	 * @async
	 * @function
	 * @instance
	 * @memberof PubsubService
	 * @name     unsubscribe
	 *
	 * @param    {string} strategy - The messaging server/exchange to connect to.
	 * @param    {string} topic - The topic to unsubscribe from.
	 * @param    {Function} listener - The callback that was used for subscribing.
	 *
	 * @returns  {undefined} Nothing.
	 *
	 * @summary  Unubscribes the listener to the specified queues.
	 */
	async unsubscribe(strategy, topic, listener) {
		try {
			let unsubscribeCount = 0;

			if(!Array.isArray(strategy))
				strategy = [strategy];

			const pubsubStrategies = Object.keys(this.$config);
			for(const pubsubStrategy of pubsubStrategies) {
				if(!strategy.includes('*') && !strategy.includes(pubsubStrategy))
					continue;

				await this.$listeners[pubsubStrategy].unsubscribeAsync(topic, listener);
				unsubscribeCount++;
			}

			if(!unsubscribeCount) throw new Error(`Unknown Strategy: ${strategy}`);
			return null;
		}
		catch(err) {
			throw new PlantWorksSrvcError(`${this.name}::unsubscribe error`, err);
		}
	}
	// #endregion

	// #region Properties
	/**
	 * @override
	 */
	get Interface() {
		return {
			'publish': this.publish.bind(this),
			'subscribe': this.subscribe.bind(this),
			'unsubscribe': this.unsubscribe.bind(this)
		};
	}

	/**
	 * @override
	 */
	get dependencies() {
		return ['ConfigurationService', 'LoggerService'].concat(super.dependencies);
	}

	/**
	 * @override
	 */
	get basePath() {
		return __dirname;
	}
	// #endregion
}

exports.service = PubsubService;
