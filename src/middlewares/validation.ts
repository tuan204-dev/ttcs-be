import { NextFunction, Request, Response } from 'express'
import { Schema } from 'joi'
import { getResponse } from '~/utils/common'

enum SchemaType {
    Body = 'body',
    Params = 'params',
    Query = 'query'
}

const SchemaValidation = (type: SchemaType, schema: Schema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            switch (type) {
                case SchemaType.Body: {
                    const value = await schema.validateAsync(req.body)
                    Object.assign(req.body, value)
                    break
                }
                case SchemaType.Params: {
                    const value = await schema.validateAsync(req.params)
                    Object.assign(req.params, value)
                    break
                }
                case SchemaType.Query: {
                    const value = await schema.validateAsync(req.query)
                    Object.assign(req.query, value)
                    break
                }
                default:
                    throw new Error('Invalid schema type')
            }
            next()
        } catch (e: any) {
            res.status(400).json(
                getResponse({
                    data: null,
                    message: e.message
                })
            )
        }
    }
}

export const validateBody = (schema: Schema) => {
    return SchemaValidation(SchemaType.Body, schema)
}

export const validateParams = (schema: Schema) => {
    return SchemaValidation(SchemaType.Params, schema)
}

export const validateQuery = (schema: Schema) => {
    return SchemaValidation(SchemaType.Query, schema)
}
