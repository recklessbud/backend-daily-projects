const joi = require('joi');

const contactSchema = joi.object({
	firstname: joi.string().required(),
	lastname: joi.string().required(),
	phone: joi.number().required(),
	zip: joi.string().required(),
});

const validateSchema = (req, res, next) => {
	const { error } = contactSchema.validate(req.body);
	if (error) {
		return res.status(400).json({
			message: error.details[0].message,
		});
	}
    next();
};


module.exports = validateSchema;