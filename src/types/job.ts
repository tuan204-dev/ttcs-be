import Joi from "joi";

export interface ISalaryRange {
    min: number;
    max: number;
}

export const salaryRangeSchema = Joi.object({
    min: Joi.number().min(0).required(),
    max: Joi.number().min(Joi.ref('min')).required()
});