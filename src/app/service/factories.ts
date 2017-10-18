import * as Ajv from 'ajv';

export const  ajvProvider = () => Ajv({allErrors: true});