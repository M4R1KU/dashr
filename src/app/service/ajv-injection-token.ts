import {InjectionToken} from '@angular/core';
import {Ajv} from 'ajv';

export const AJV = new InjectionToken<Ajv>('ajv');
