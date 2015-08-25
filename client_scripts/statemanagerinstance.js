
var StateManager = require('./statemanager');

module.exports = function() {
	return new StateManager(
		{
			'title': {
				'opacity': {
					'default': '0.0',
					'duration': '1.0'
				}
			},
			'body': {
				'background': {
					'default': 'rgb(32,32,32)',
					'duration': '1.0'
				}
			},
			'mainArea': {
				'top': {
					'default': '-100%',
					'duration': '1.0'
				}
			},
			'toolsList': {
				'top': {
					'default': '100%',
					'duration': '1.0'
				}
			},
			'objectsList': {
				'right': {
					'default': '-300px',
					'duration': '1.0'
				}
			},
			'propertiesList': {
				'right': {
					'default': '-300px',
					'duration': '1.0'
				}
			}
		},
		{
			'project': {
				'body': {'background': 'rgb(48,48,48)'},
				'mainArea': {'top': '0%'},
				'toolsList': {'top': '0%'},
				'objectsList': {'right': '0px'},
				'propertiesList': {'right': '0px'}
			},
			'selecttransition': {
				'body': {'background': 'rgb(32,32,32)'}
			},
			'selectproject': {
				'body': {'background': 'rgb(32,32,32)'},
				'title': {'opacity': '1.0'}
			}
		},
		{
			'selectproject-project': ['selecttransition']
		}
	);
}
