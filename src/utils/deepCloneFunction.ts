// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deepCloneFunction = (inObject: any) => {
    if (typeof inObject !== 'object' || inObject === null) {
        return inObject;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const outObject: any = Array.isArray(inObject) ? [] : {};

    for (const key in inObject) {
        const value = inObject[key];
        outObject[key] = deepCloneFunction(value);
    }
    return outObject;
};

export default deepCloneFunction;
