import { ComponentProps, ComponentType, memo } from "react";


/**
 * @description Same as usual memo, but memoized component with children
 * won't rerender until it AND its direct children have a reason.
 * @param component - Component to memoize
 */
export const childrenCompareMemo = <T extends ComponentType<any>>(component: T) => memo(component, (
    prevProps: Readonly<ComponentProps<T>>,
    nextProps: Readonly<ComponentProps<T>>
):boolean => {
    const [ch1, oth1] = getChildrenAndOther(prevProps);
    const [ch2, oth2] = getChildrenAndOther(nextProps);

    const otherEqual = shallowEqual(oth1, oth2);
    if (!otherEqual || (ch1 && !ch2) || (ch2 && !ch1)) return false;

    if (otherEqual && shallowEqual(ch1, ch2)) return true;

    //if plain object
    if (ch1.props && ch2.props) {
        return shallowEqual(ch1.props, ch2.props);
    }
    //if multiple children
    if (Array.isArray(ch1) && Array.isArray(ch2)) {
        return ch1.every((_, i) => shallowEqual(ch1[i].props, ch2[i].props));
    }
    //if ch1 and ch2 have structure difference
    return false;
})

/**
 * @description Same as usual memo, but memoized component with children
 * won't rerender until it AND any of its children have a reason
 * (if children of any level has a reason to rerender, the whole component will rerender too)
 * @param component - Component to memoize
 */
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

    // console.log({prevProps, nextProps})
    const [ch1, oth1] = getChildrenAndOther(prevProps);
    const [ch2, oth2] = getChildrenAndOther(nextProps);

    const otherEqual = shallowEqual(oth1, oth2);
    if (!otherEqual || (ch1 && !ch2) || (ch2 && !ch1)) return false;
    else if (otherEqual && shallowEqual(ch1, ch2)) return true;
    //if otherEqual is true and both children exist, but not equal

    //if plain object
    if (ch1.props && ch2.props) {
        return nestedEqual(ch1.props, ch2.props);
    }
    //if multiple children
    if (Array.isArray(ch1) && Array.isArray(ch2)) {
        return ch1.every((_, i) => nestedEqual(ch1[i].props, ch2[i].props));
    }
    //if ch1 and ch2 have structure difference
    return false;
}
