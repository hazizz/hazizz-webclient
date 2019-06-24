export const updateObject = (oldObject, withObject) => (
    {
        ...oldObject,
        ...withObject
    }
);