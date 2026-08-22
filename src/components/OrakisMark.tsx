import { useId } from 'react';

/**
 * The Orakis octagon: a filled octagon with a mask punching out the inner
 * octagon plus two opposing cuts, which is what gives the mark its rotated-S
 * negative space. The mask id must be unique per instance because the mark
 * renders more than once per screen.
 */
export function OrakisMark({
  size = 24,
  fill = 'currentColor',
  className,
}: {
  size?: number;
  fill?: string;
  className?: string;
}) {
  const maskId = `orakis-mark-${useId()}`;
  const outer = '32.4,7.76 67.6,7.76 92.24,32.4 92.24,67.6 67.6,92.24 32.4,92.24 7.76,67.6 7.76,32.4';

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <polygon points={outer} fill="white" />
          <polygon
            points="41.2,30.64 58.8,30.64 69.36,41.2 69.36,58.8 58.8,69.36 41.2,69.36 30.64,58.8 30.64,41.2"
            fill="black"
          />
          <polygon points="58.8,30.64 69.36,41.2 85.53,25.03 74.97,14.47" fill="black" />
          <polygon points="41.2,69.36 30.64,58.8 14.47,74.97 25.03,85.53" fill="black" />
        </mask>
      </defs>
      <polygon points={outer} fill={fill} mask={`url(#${maskId})`} />
    </svg>
  );
}
