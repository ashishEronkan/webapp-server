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
 * @classdesc The Plant.Works Web Application Server Tenant Administration Groups Main middleware - manages CRUD for tenant groups.
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

					'tenantUsers': function() {
						return this.hasMany(self.$TenantUserModel, 'tenant_id');
					},

					'tenantGroups': function() {
						return this.hasMany(self.$TenantGroupModel, 'tenant_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantFeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_features',
					'idAttribute': 'tenant_feature_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantGroupModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_groups',
					'idAttribute': 'tenant_group_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'parent': function() {
						return this.belongsTo(self.$TenantGroupModel, 'parent_tenant_group_id');
					},

					'groups': function() {
						return this.hasMany(self.$TenantGroupModel, 'parent_tenant_group_id');
					},

					'tenantUserGroups': function() {
						return this.hasMany(self.$TenantUserGroupModel, 'tenant_group_id');
					},

					'permissions': function() {
						return this.hasMany(self.$TenantGroupPermissionModel, 'tenant_group_id', 'tenant_group_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantGroupPermissionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenant_group_permissions',
					'idAttribute': 'tenant_group_permission_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantGroup': function() {
						return this.belongsTo(self.$TenantGroupModel, 'tenant_group_id', 'tenant_group_id');
					},

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'feature_id');
					},

					'featurePermission': function() {
						return this.belongsTo(self.$FeaturePermissionModel, 'feature_permission_id', 'feature_permission_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantUserGroupModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users_groups',
					'idAttribute': 'tenant_user_group_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'tenantGroup': function() {
						return this.belongsTo(self.$TenantGroupModel, 'tenant_group_id');
					},

					'tenantUser': function() {
						return this.belongsTo(self.$TenantUserModel, 'user_id', 'user_id');
					}
				})
			});

			Object.defineProperty(this, '$TenantUserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'tenants_users',
					'idAttribute': 'tenant_user_id',
					'hasTimestamps': true,

					'tenant': function() {
						return this.belongsTo(self.$TenantModel, 'tenant_id');
					},

					'user': function() {
						return this.belongsTo(self.$UserModel, 'user_id');
					},

					'tenantUserGroups': function() {
						this.hasMany(self.$TenantUserModel, 'user_id');
					}
				})
			});

			Object.defineProperty(this, '$UserModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'users',
					'idAttribute': 'user_id',
					'hasTimestamps': true,

					'tenantUsers': function() {
						return this.hasMany(self.$TenantUserModel, 'user_id');
					}
				})
			});

			Object.defineProperty(this, '$FeaturePermissionModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'feature_permissions',
					'idAttribute': 'feature_permission_id',
					'hasTimestamps': true,

					'feature': function() {
						return this.belongsTo(self.$FeatureModel, 'module_id');
					},

					'tenantGroupPermissions': function() {
						return this.hasMany(self.$TenantGroupPermissionModel, 'feature_permission_id', 'feature_permission_id');
					}
				})
			});

			Object.defineProperty(this, '$FeatureModel', {
				'__proto__': null,
				'configurable': true,

				'value': dbSrvc.Model.extend({
					'tableName': 'modules',
					'idAttribute': 'module_id',
					'hasTimestamps': true,

					'parent': function() {
						return this.belongsTo(self.$FeatureModel, 'parent_module_id');
					},

					'modules': function() {
						return this.hasMany(self.$FeatureModel, 'parent_module_id');
					},

					'permissions': function() {
						return this.hasMany(self.$FeaturePermissionModel, 'module_id');
					},

					'tenant_features': function() {
						return this.hasMany(self.$TenantFeatureModel, 'module_id');
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
			delete this.$FeatureModel;
			delete this.$FeaturePermissionModel;
			delete this.$UserModel;
			delete this.$TenantUserModel;
			delete this.$TenantUserGroupModel;
			delete this.$TenantGroupPermissionModel;
			delete this.$TenantGroupModel;
			delete this.$TenantFeatureModel;
			delete this.$TenantModel;

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

			await ApiService.add(`${this.name}::getTenantGroupTree`, this._getTenantGroupTree.bind(this));
			await ApiService.add(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));

			await ApiService.add(`${this.name}::getTenantGroup`, this._getTenantGroup.bind(this));
			await ApiService.add(`${this.name}::addTenantGroup`, this._addTenantGroup.bind(this));
			await ApiService.add(`${this.name}::updateTenantGroup`, this._updateTenantGroup.bind(this));
			await ApiService.add(`${this.name}::deleteTenantGroup`, this._deleteTenantGroup.bind(this));

			await ApiService.add(`${this.name}::getTenantUserGroup`, this._getTenantUserGroup.bind(this));
			await ApiService.add(`${this.name}::addTenantUserGroup`, this._addTenantUserGroup.bind(this));
			await ApiService.add(`${this.name}::deleteTenantUserGroup`, this._deleteTenantUserGroup.bind(this));

			await ApiService.add(`${this.name}::getTenantGroupPermission`, this._getTenantGroupPermission.bind(this));
			await ApiService.add(`${this.name}::addTenantGroupPermission`, this._addTenantGroupPermission.bind(this));
			await ApiService.add(`${this.name}::deleteTenantGroupPermission`, this._deleteTenantGroupPermission.bind(this));

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

			await ApiService.remove(`${this.name}::deleteTenantGroupPermission`, this._deleteTenantGroupPermission.bind(this));
			await ApiService.remove(`${this.name}::addTenantGroupPermission`, this._addTenantGroupPermission.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroupPermission`, this._getTenantGroupPermission.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantUserGroup`, this._deleteTenantUserGroup.bind(this));
			await ApiService.remove(`${this.name}::addTenantUserGroup`, this._addTenantUserGroup.bind(this));
			await ApiService.remove(`${this.name}::getTenantUserGroup`, this._getTenantUserGroup.bind(this));

			await ApiService.remove(`${this.name}::deleteTenantGroup`, this._deleteTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::updateTenantGroup`, this._updateTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::addTenantGroup`, this._addTenantGroup.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroup`, this._getTenantGroup.bind(this));

			await ApiService.remove(`${this.name}::possibleTenantUsersList`, this._getPossibleTenantUsersList.bind(this));
			await ApiService.remove(`${this.name}::getTenantGroupTree`, this._getTenantGroupTree.bind(this));

			await super._deregisterApis();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deregisterApis`, err);
		}
	}
	// #endregion

	// #region API
	async _getTenantGroupTree(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			let tenantGroups = null;
			if(ctxt.query.id === '#')
				tenantGroups = await dbSrvc.knex.raw(`SELECT tenant_group_id AS id, COALESCE(CAST(parent_tenant_group_id AS text), '#') AS parent, display_name AS text FROM tenant_groups WHERE tenant_id = ?`, [ctxt.state.tenant.tenant_id]);
			else
				tenantGroups = await dbSrvc.knex.raw(`SELECT tenant_group_id AS id, COALESCE(CAST(parent_tenant_group_id AS text), '#') AS parent, display_name AS text FROM tenant_groups WHERE tenant_id = ? AND tenant_group_id IN (SELECT tenant_group_id FROM fn_get_group_descendants(?) WHERE level >= 2)`, [ctxt.state.tenant.tenant_id, ctxt.query.id]);

			return tenantGroups.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroupTree`, err);
		}
	}

	async _getPossibleTenantUsersList(ctxt) {
		try {
			const dbSrvc = this.$dependencies.DatabaseService;

			const possibleTenantUsers = await dbSrvc.knex.raw(`SELECT A.tenant_user_id AS id, B.first_name AS "firstName", B.middle_names AS "middleNames", B.last_name AS "lastName", B.email FROM tenants_users A INNER JOIN users B ON (A.user_id = B.user_id) WHERE A.tenant_id = ? AND A.access_status = 'authorized' AND A.user_id NOT IN (SELECT user_id FROM tenants_users_groups WHERE tenant_group_id IN (SELECT tenant_group_id FROM fn_get_group_ancestors(?)))`, [ctxt.state.tenant.tenant_id, ctxt.query.group]);
			return possibleTenantUsers.rows;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getPossibleTenantUsersList`, err);
		}
	}

	async _getTenantGroup(ctxt) {
		try {
			const TenantGroupRecord = new this.$TenantGroupModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_group_id': ctxt.params['tenant_group_id']
			});

			let tenantGroupData = await TenantGroupRecord.fetch({
				'withRelated': (ctxt.query.include && ctxt.query.include.length) ? ctxt.query.include.split(',').map((incl) => { return incl.trim(); }) : ['tenant', 'parent', 'groups', 'permissions', 'tenantUserGroups', 'permissions.tenant', 'permissions.tenantGroup', 'permissions.feature', 'permissions.featurePermission']
			});

			tenantGroupData = this.$jsonApiMapper.map(tenantGroupData, 'tenant-administration/group-manager/tenant-group', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'parent': 'tenant-administration/group-manager/tenant-group',
					'groups': 'tenant-administration/group-manager/tenant-group',
					'permissions': 'tenant-administration/group-manager/tenant-group-permission',
					'feature': 'server-administration/feature',
					'featurePermission': 'server-administration/feature-permission',
					'tenantGroup': 'tenant-administration/group-manager/tenant-group',
					'tenantUserGroups': 'tenant-administration/group-manager/tenant-user-group'
				},

				'enableLinks': false
			});

			tenantGroupData.included = tenantGroupData.included.filter((inclRsrc) => {
				return inclRsrc.type === 'tenant-administration/group-manager/tenant-group-permission';
			});
			return tenantGroupData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroup`, err);
		}
	}

	async _addTenantGroup(ctxt) {
		try {
			const tenantGroup = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantGroup);
			jsonDeserializedData['tenant_group_id'] = jsonDeserializedData.id;

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantGroup.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantGroup.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantGroup.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantGroup.data.relationships[relationshipName].data.id;
			});

			jsonDeserializedData['parent_tenant_group_id'] = jsonDeserializedData['parent_id'];
			delete jsonDeserializedData['parent_id'];

			const savedRecord = await this.$TenantGroupModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': tenantGroup.data.type,
					'id': savedRecord.get('tenant_group_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantGroup`, err);
		}
	}

	async _updateTenantGroup(ctxt) {
		try {
			const tenantGroup = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantGroup);
			jsonDeserializedData['tenant_group_id'] = jsonDeserializedData.id;

			Object.keys(tenantGroup.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantGroup.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantGroup.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantGroup.data.relationships[relationshipName].data.id;
			});

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			const savedRecord = await this.$TenantGroupModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'update',
					'patch': true
				});

			return {
				'data': {
					'type': tenantGroup.data.type,
					'id': savedRecord.get('tenant_group_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_updateTenantGroup`, err);
		}
	}

	async _deleteTenantGroup(ctxt) {
		try {
			const tenantGroup = await new this.$TenantGroupModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_group_id': ctxt.params['tenant_group_id']
			})
			.fetch();

			if(!tenantGroup) throw new Error('Unknown Tenant Group');
			if(tenantGroup.get('default_for_new_user')) throw new Error('Cannot delete default group');

			await tenantGroup.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantGroup`, err);
		}
	}

	async _getTenantUserGroup(ctxt) {
		try {
			const TenantUserGroupRecord = new this.$TenantUserGroupModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_user_group_id': ctxt.params['tenant_user_group_id']
			});

			// const self = this; // eslint-disable-line consistent-this
			let tenantUserGroupData = await TenantUserGroupRecord.fetch({
				'withRelated': [
					'tenant',
					{
						'tenantUser': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						},
						'tenantGroup': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						}
					}
				]
			});

			tenantUserGroupData = this.$jsonApiMapper.map(tenantUserGroupData, 'tenant-administration/group-manager/tenant-user-group', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'tenantUser': 'tenant-administration/user-manager/tenant-user',
					'tenantGroup': 'tenant-administration/group-manager/tenant-group'
				},

				'enableLinks': false
			});

			delete tenantUserGroupData.included;
			return tenantUserGroupData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantUserGroup`, err);
		}
	}

	async _addTenantUserGroup(ctxt) {
		try {
			const tenantUserGroup = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantUserGroup);
			jsonDeserializedData['tenant_user_group_id'] = jsonDeserializedData.id;

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantUserGroup.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantUserGroup.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantUserGroup.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantUserGroup.data.relationships[relationshipName].data.id;
			});

			const tenantUser = await new this.$TenantUserModel({
				'tenant_user_id': jsonDeserializedData['tenant_user_id']
			}).fetch();

			if(!tenantUser) throw new Error(`Invalid Tenant User`);

			jsonDeserializedData['tenant_id'] = ctxt.state.tenant.tenant_id;
			jsonDeserializedData['user_id'] = tenantUser.get('user_id');

			delete jsonDeserializedData['tenant_user_id'];

			const savedRecord = await this.$TenantUserGroupModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': tenantUserGroup.data.type,
					'id': savedRecord.get('tenant_user_group_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantUserGroup`, err);
		}
	}

	async _deleteTenantUserGroup(ctxt) {
		try {
			const tenantUserGroup = await new this.$TenantUserGroupModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_user_group_id': ctxt.params['tenant_user_group_id']
			})
			.fetch();

			if(!tenantUserGroup) throw new Error('Unknown Tenant User to Group mapping');

			await tenantUserGroup.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantUserGroup`, err);
		}
	}

	async _getTenantGroupPermission(ctxt) {
		try {
			const TenantGroupPermissionRecord = new this.$TenantGroupPermissionModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_group_permission_id': ctxt.params['tenant_group_permission_id']
			});

			// const self = this; // eslint-disable-line consistent-this
			let tenantGroupPermissionData = await TenantGroupPermissionRecord.fetch({
				'withRelated': [
					'tenant', 'feature', 'featurePermission',
					{
						'tenantGroup': function(qb) {
							qb.where('tenant_id', '=', ctxt.state.tenant.tenant_id);
						}
					}
				]
			});

			tenantGroupPermissionData = this.$jsonApiMapper.map(tenantGroupPermissionData, 'tenant-administration/group-manager/tenant-group-permission', {
				'typeForModel': {
					'tenant': 'tenant-administration/tenant',
					'tenantGroup': 'tenant-administration/group-manager/tenant-group',
					'feature': 'server-administration/feature',
					'featurePermission': 'server-administration/feature-permission'
				},

				'enableLinks': false
			});

			delete tenantGroupPermissionData.included;
			return tenantGroupPermissionData;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_getTenantGroupPermission`, err);
		}
	}

	async _addTenantGroupPermission(ctxt) {
		try {
			const tenantGroupPermission = ctxt.request.body;

			const jsonDeserializedData = await this.$jsonApiDeserializer.deserializeAsync(tenantGroupPermission);
			jsonDeserializedData['tenant_group_permission_id'] = jsonDeserializedData.id;

			delete jsonDeserializedData.id;
			delete jsonDeserializedData.created_at;
			delete jsonDeserializedData.updated_at;

			Object.keys(tenantGroupPermission.data.relationships || {}).forEach((relationshipName) => {
				if(!tenantGroupPermission.data.relationships[relationshipName].data) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				if(!tenantGroupPermission.data.relationships[relationshipName].data.id) {
					delete jsonDeserializedData[relationshipName];
					return;
				}

				jsonDeserializedData[`${relationshipName}_id`] = tenantGroupPermission.data.relationships[relationshipName].data.id;
			});

			let feature = await this.$dependencies.DatabaseService.knex.raw(`SELECT module_id FROM feature_permissions WHERE feature_permission_id = ?`, [jsonDeserializedData.feature_permission_id]);
			feature = feature.rows.pop();

			if(!feature) throw new Error(`Invalid Permission`);

			jsonDeserializedData['tenant_id'] = ctxt.state.tenant.tenant_id;
			jsonDeserializedData['feature_id'] = feature['module_id'];

			const savedRecord = await this.$TenantGroupPermissionModel
				.forge()
				.save(jsonDeserializedData, {
					'method': 'insert',
					'patch': false
				});

			return {
				'data': {
					'type': tenantGroupPermission.data.type,
					'id': savedRecord.get('tenant_group_permission_id')
				}
			};
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_addTenantUserGroup`, err);
		}
	}

	async _deleteTenantGroupPermission(ctxt) {
		try {
			const tenantGroupPermission = await new this.$TenantGroupPermissionModel({
				'tenant_id': ctxt.state.tenant['tenant_id'],
				'tenant_group_permission_id': ctxt.params['tenant_group_permission_id']
			})
			.fetch();

			if(!tenantGroupPermission) throw new Error('Unknown Permission to Group mapping');

			await tenantGroupPermission.destroy();
			return null;
		}
		catch(err) {
			throw new PlantWorksMiddlewareError(`${this.name}::_deleteTenantGroupPermission`, err);
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
