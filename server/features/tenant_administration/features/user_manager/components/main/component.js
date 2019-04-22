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
 * @classdesc The Main component of the Profile Feature - manages CRUD for the User's profile.
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
			this.$router.get('/searchUsers', this.$parent._rbac('user-manager-read'), this._searchUsers.bind(this));
			this.$router.post('/resetPassword', this.$parent._rbac('user-manager-read'), this._resetUserPassword.bind(this));

			this.$router.get('/tenant-users', this.$parent._rbac('user-manager-read'), this._getTenantUsers.bind(this));

			this.$router.get('/tenant-users/:tenantUserId', this.$parent._rbac('user-manager-read'), this._getTenantUser.bind(this));
			this.$router.post('/tenant-users', this.$parent._rbac('user-manager-update'), this._createTenantUser.bind(this));
			this.$router.patch('/tenant-users/:tenantUserId', this.$parent._rbac('user-manager-update'), this._updateTenantUser.bind(this));
			this.$router.delete('/tenant-users/:tenantUserId', this.$parent._rbac('user-manager-update'), this._deleteTenantUser.bind(this));

			this.$router.get('/get-image/:tenantUserId', this.$parent._rbac('user-manager-read'), this._getTenantUserImage.bind(this));
			this.$router.post('/upload-image/:tenantUserId', this.$parent._rbac('user-manager-update'), this._updateTenantUserImage.bind(this));

			this.$router.get('/users/:userId', this.$parent._rbac('user-manager-read'), this._getUser.bind(this));
			this.$router.post('/users', this.$parent._rbac('user-manager-update'), this._createUser.bind(this));
			this.$router.patch('/users/:userId', this.$parent._rbac('user-manager-update'), this._updateUser.bind(this));
			this.$router.delete('/users/:userId', this.$parent._rbac('user-manager-update'), this._deleteUser.bind(this));

			await super._addRoutes();
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`${this.name}::_addRoutes error`, err);
		}
	}
	// #endregion

	// #region Route Handlers
	async _searchUsers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const userList = await apiSrvc.execute('Main::searchUsers', ctxt);

			ctxt.status = 200;
			ctxt.body = userList.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error searching for users`, err);
		}
	}

	async _resetUserPassword(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const resetPasswordStatus = await apiSrvc.execute('Main::resetUserPassword', ctxt);

			ctxt.status = 200;
			ctxt.body = resetPasswordStatus.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error resetting user password`, err);
		}
	}

	async _getTenantUsers(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const tenantUsers = await apiSrvc.execute('Main::getAllTenantUsers', ctxt);

			ctxt.status = 200;
			ctxt.body = tenantUsers.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving tenant users`, err);
		}
	}

	async _getTenantUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::getTenantUser', ctxt);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting tenant user`, err);
		}
	}

	async _createTenantUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::createTenantUser', ctxt);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant user`, err);
		}
	}

	async _updateTenantUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			const status = await apiSrvc.execute('Main::updateTenantUser', ctxt);

			ctxt.status = 200;
			ctxt.body = status.shift();

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating tenant user`, err);
		}
	}

	async _deleteTenantUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteTenantUser', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting tenant user`, err);
		}
	}

	async _getTenantUserImage(ctxt) {
		try {
			const path = require('path');
			const send = require('koa-send');

			const apiSrvc = this.$dependencies.ApiService;

			let userData = await apiSrvc.execute('Main::getUserFromTenantUser', ctxt);
			userData = userData.shift();

			const profileImageFolder = this.$parent.$config.profileImagePath;
			const profileImagePath = path.join(profileImageFolder, `${userData.data.attributes.profile_image}.png`);
			const profileImageExists = await this._exists(profileImagePath);

			if(profileImageExists)
				await send(ctxt, profileImagePath);
			else
				await send(ctxt, path.join(profileImageFolder, 'anonymous.jpg'));

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error retrieving user image`, err);
		}
	}

	async _updateTenantUserImage(ctxt) {
		try {
			const fs = require('fs');
			const path = require('path');
			const promises = require('bluebird');
			const uuid = require('uuid/v4');

			const filesystem = promises.promisifyAll(fs);

			const apiSrvc = this.$dependencies.ApiService;

			let userData = await apiSrvc.execute('Main::getUserFromTenantUser', ctxt);
			userData = userData.shift();

			const currentImageId = userData.data.attributes.profile_image,
				image = ctxt.request.body.image.replace(/' '/g, '+').replace('data:image/png;base64,', ''),
				imageId = uuid().toString();

			let profileImageFolder = this.$parent.$config.profileImagePath;
			if(!path.isAbsolute(profileImageFolder)) profileImageFolder = path.join(path.dirname(path.dirname(require.main.filename)), profileImageFolder);

			const profileImagePath = path.join(profileImageFolder, `${imageId}.png`);
			await filesystem.writeFileAsync(profileImagePath, Buffer.from(image, 'base64'));

			ctxt.request.body = {
				'data': {
					'id': userData.data.id,
					'type': 'tenant-administration/user-manager/user',
					'attributes': {
						'profile_image': imageId,
						'profile_image_metadata': ctxt.request.body.metadata
					}
				}
			};

			await apiSrvc.execute('Main::updateUser', ctxt);

			ctxt.status = 200;
			ctxt.body = {
				'status': true,
				'responseText': 'Profile Image Updated succesfully'
			};

			if(!currentImageId) return null;
			if(currentImageId === 'f8a9da32-26c5-495a-be9a-42f2eb8e4ed1') return null;

			const currentImageExists = await this._exists(path.join(profileImageFolder, `${currentImageId}.png`));
			if(currentImageExists) await filesystem.unlinkAsync(path.join(profileImageFolder, `${currentImageId}.png`));

			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating user image`, err);
		}
	}

	async _getUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;

			let user = await apiSrvc.execute('Main::getUser', ctxt);
			user = user.shift();

			ctxt.status = 200;
			ctxt.body = user;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error getting user`, err);
		}
	}

	async _createUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;

			let user = await apiSrvc.execute('Main::createUser', ctxt);
			user = user.shift();

			ctxt.status = 200;
			ctxt.body = user;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error creating user`, err);
		}
	}

	async _updateUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;

			let updateStatus = await apiSrvc.execute('Main::updateUser', ctxt);
			updateStatus = updateStatus.shift();

			ctxt.status = 200;
			ctxt.body = updateStatus;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error updating user`, err);
		}
	}

	async _deleteUser(ctxt) {
		try {
			const apiSrvc = this.$dependencies.ApiService;
			await apiSrvc.execute('Main::deleteUser', ctxt);

			ctxt.status = 204;
			return null;
		}
		catch(err) {
			throw new PlantWorksComponentError(`Error deleting user`, err);
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
