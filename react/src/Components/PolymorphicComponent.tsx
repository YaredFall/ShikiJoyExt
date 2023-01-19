import React, { ElementType, memo } from "react";
import { childrenCompareMemo, nestedChildrenCompareMemo } from "../Utils/childrenCompareMemo";


type AsProp<C extends React.ElementType> = {
    as?: C;
};

type Polymorphic<C extends ElementType = "div"> = AsProp<C> & Omit<React.ComponentPropsWithRef<C>, keyof AsProp<C>>
type PolyRef<C extends ElementType = "div"> = React.ComponentPropsWithRef<C>["ref"]

type PolymorphicFC = <C extends React.ElementType = "div">(
    props: Polymorphic<C>
) => React.ReactElement | null;

export const PolymorphicComponent: PolymorphicFC = React.forwardRef(<C extends ElementType = "div">(props: Polymorphic<C>, ref?: PolyRef<C>) => {
    const { as, ...other } = { ...props }
    const Tag = as || "div";

    return <Tag {...other} ref={ref} />
})

export const ChildrenMemoPolymorphicComponent: PolymorphicFC = childrenCompareMemo(PolymorphicComponent)
export const NestedChildrenMemoPolymorphicComponent: PolymorphicFC = nestedChildrenCompareMemo(PolymorphicComponent)