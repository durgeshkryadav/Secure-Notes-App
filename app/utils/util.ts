export function isEmpty(value: any): boolean {
    return (
        value === undefined ||
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)
    );
}

export function isObjectId(value: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(value);
}
