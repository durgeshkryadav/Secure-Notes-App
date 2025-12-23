/* *******************************************
 *	Purpose: Common Application Utilities    *
 ******************************************* */
import { ILooseObject } from '@common/interfaces/ILooseObject';
import { IResponse } from '@common/interfaces/IResponse';
import { Response } from 'express';

export async function randString(x: number): Promise<string> {
    let s = '';
    while (s.length < x && x > 0) {
        const r = Math.random();
        s += r < 0.1 ? Math.floor(r * 100) : String.fromCharCode(Math.floor(r * 26) + (r > 0.5 ? 97 : 65));
    }
    return s;
}

export function sum(items: ILooseObject[], prop: string): number {
    return items.reduce((a, b) => {
        if (b[prop]) {
            return a + b[prop];
        } else {
            return a;
        }
    }, 0);
}

export async function err(data: ILooseObject, message: string, code = 500) {
    return {
        data: data,
        message: message,
        code: code,
    };
}

export async function asyncForEach(array: ILooseObject[], callback: any) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

export async function sendResponse(
    res: Response,
    data: any | undefined,
    message: string | undefined,
    success: boolean,
    code = 200
) {
    const responseObj: IResponse = {
        message: message || 'Something went wrong',
        success: success,
    };
    if (data && Object.keys(data)?.length) {
        responseObj.data = data;
    }
    return res.status(code).json(responseObj);
}

export function isEmpty(value: any): boolean {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}
