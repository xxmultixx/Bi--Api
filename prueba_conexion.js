var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
	server: "192.168.1.2", // or "localhost"
	options: {
		cryptoCredentialsDetails: {
			minVersion: 'TLSv1'
		},
		database: "epker",
	},
	authentication: {
		type: "default",
		options: {
			userName: "ltapia",
			password: "ltapia2021_BI",
		}
	}
};

var connection = new Connection(config);

// Setup event handler when the connection is established. 
connection.on('connect', function (err) {
	if (err) {
		console.log('Error: ', err);
		return false;
	}
	// If no error, then good to go...
	console.log('conectado');
	executeStatement();
});

function executeStatement() {
	request = new Request("exec SP_OBTIENE_CARGAS @usuario = 'epker'", function (err, rowCount) {
		if (err) {
			console.log(err);
		} else {
			console.log(rowCount + ' rows');
		}
	});

	request.on('row', function (columns) {
		console.log(columns);
		// columns.forEach(function (column) {
		// 	console.log(column);
		// });
	});

	connection.execSql(request);
}

// Initialize the connection.
connection.connect();