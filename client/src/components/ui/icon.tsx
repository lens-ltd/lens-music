import type { IconType } from 'react-icons';
import type { SVGAttributes } from 'react';

interface IconProps extends SVGAttributes<SVGElement> {
  icon: IconType;
  size?: string | number;
}

/** Renders a react-icons component chosen at runtime. Decorative by default. */
export function Icon({ icon: Glyph, ...props }: IconProps) {
  return <Glyph aria-hidden="true" focusable="false" {...props} />;
}
