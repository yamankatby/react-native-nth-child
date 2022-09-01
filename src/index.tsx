import type { FC } from 'react';
import React, { cloneElement } from 'react';
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { getValidChildren } from './utilities';

type Style = StyleProp<ViewStyle | TextStyle | ImageStyle>;

type ChildrenStyle = Style | ((index: number, length: number) => Style);

type ChildrenStyleProp = ChildrenStyle | Array<ChildrenStyleProp>;

export interface SelectorProps extends ViewProps {
  /**
   * A style object to apply to each child.
   */
  childrenStyle?: ChildrenStyleProp;
}

const Selector: FC<SelectorProps> = ({ childrenStyle, children, ...rest }) => {
  const styles = Array.isArray(childrenStyle)
    ? childrenStyle.flat(21)
    : [childrenStyle];

  const validChildren = getValidChildren(children);

  return (
    <View {...rest}>
      {validChildren.map((child, index) =>
        cloneElement(child, {
          style: [
            child.props.style,
            styles.map((style) =>
              typeof style === 'function'
                ? style(index, validChildren.length)
                : style
            ),
          ],
        })
      )}
    </View>
  );
};

export default Selector;

export const select =
  (selector: (index: number, length: number) => boolean) =>
  (style: Style) =>
  (index: number, length: number) =>
    selector(index, length) ? style : null;

export const firstChild = select((index) => index === 0);

export const notFirstChild = select((index) => index !== 0);

export const lastChild = select((index, length) => index === length - 1);

export const notLastChild = select((index, length) => index !== length - 1);

export const even = select((index) => index % 2 === 0);

export const odd = select((index) => index % 2 !== 0);

export const nthChild = (n: number, style: Style) =>
  select((index) => index === n)(style);

export const notNthChild = (n: number, style: Style) =>
  select((index) => index !== n)(style);

export const nthLastChild = (n: number, style: Style) =>
  select((index, length) => index === length - n - 1)(style);

export const notNthLastChild = (n: number, style: Style) =>
  select((index, length) => index !== length - n - 1)(style);
