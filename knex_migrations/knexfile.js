'use strict';

module.exports = {
	'development': {
		'client': 'pg',
		'debug': false,

		'connection': {
			'database': 'plantworks',
			'user': 'plantworks',
			'password': 'plantworks'
		},

		'migrations': {
			'tableName': 'knex_migrations'
		}
	},

	'test': {
		'client': 'pg',
		'debug': false,

		'connection': {
			'database': 'plantworks',
			'user': 'plantworks',
			'password': 'plantworks'
		},

		'migrations': {
			'tableName': 'knex_migrations'
		}
	},

	'production': {
		'client': 'pg',
		'debug': false,

		'connection': {
			'database': 'plantworks',
			'user': 'plantworks',
			'password': 'plantworks'
		},

		'migrations': {
			'tableName': 'knex_migrations'
		}
	}
};
