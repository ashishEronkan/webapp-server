exports.config = {
	"randomServer": {
		"apiKey": "YOUR_API_KEY"
	},
	"passwordFormat": {
		"n": 1,
		"length": 12,
		"characters": "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	},
	"resetPasswordMail": {
		"from": "do-not-reply@plant.works",
		"subject": "Plant.Works generated random password"
	}
};
