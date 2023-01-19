import { ComponentProps, ComponentType, memo } from "react";

export const childrenCompareMemo = <T extends ComponentType<any>>(component: T) => memo(component, (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
) => {
    const [ch1, oth1] = getChildrenAndOther(prevProps);
    const [ch2, oth2] = getChildrenAndOther(nextProps);

    return shallowEqual(ch1?.props, ch2?.props) && shallowEqual(oth1, oth2)
})

export const nestedChildrenCompareMemo = <T extends ComponentType<any>>(component: T) => memo(component, (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
) => {
    return nestedEqual(prevProps, nextProps)
})


//Helpers
const isObject = (value: any) => typeof value === 'object' && value !== null;

function compareObjects(A: Object, B: Object) {
    const keysA = Object.keys(A);
    const keysB = Object.keys(B);

    if (keysA.length !== keysB.length) {
        return false;
    }

    return !keysA.some(key => !B.hasOwnProperty(key) || A[key as keyof Object] !== B[key as keyof Object]);
};

function shallowEqual(A: any, B: any) {
    if (A === B) {
        return true;
    }

    if ([A, B].every(Number.isNaN)) {
        return true;
    }

    if (![A, B].every(isObject)) {
        return false;
    }

    return compareObjects(A, B);
};

function getChildrenAndOther(obj: Object) {
    //@ts-ignore
    const { children, ...other } = { ...obj }
    return [children || null, other]
}

function nestedEqual(prevProps: any, nextProps: any): boolean {

    const [ch1, oth1] = getChildrenAndOther(prevProps);
    const [ch2, oth2] = getChildrenAndOther(nextProps);

    const childrenEqual = shallowEqual(ch1?.props, ch2?.props);
    const otherEqual = shallowEqual(oth1, oth2);
    if (childrenEqual && otherEqual) {
        return true;
    } else if (otherEqual && !childrenEqual) {
        if (ch1 && ch2) {
            return nestedEqual(ch1.props, ch2.props);
        } else {
            return false;
        }
    } else {
        return false;
    }
}
