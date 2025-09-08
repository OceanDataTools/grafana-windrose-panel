import React, { useState, useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { useTheme } from '@grafana/ui';
import { PanelDataErrorView } from '@grafana/runtime';
import { SimpleOptions } from 'types';

export const WindrosePanel: React.FC<PanelProps<SimpleOptions>> = ({
  data,
  width,
  height,
  options,
  fieldConfig,
  id,
}) => {
  const size = Math.min(width, height);
  const radius = size / 2;

  const theme = useTheme();

  // === Extract helpers ===
  const extractLatest = (fieldName?: string): number | null => {
    if (!fieldName) {
      return null;
    }
    for (const series of data.series) {
      const field = series.fields.find((f) => f.name === fieldName);
      if (field && field.values.length) {
        return field.values[field.values.length - 1] as number;
      }
    }
    return null;
  };

  const shipHeading = extractLatest(options.headingField) ?? 0;
  const trueWind = extractLatest(options.trueWindField) ?? 0;
  const apparentWind = extractLatest(options.apparentWindField) ?? 0;

  // === Smooth direction interpolation ===
  const [displayHeading, setDisplayHeading] = useState(shipHeading);
  const cumulativeHeadingRef = useRef(shipHeading);

  const [displayTruewind, setDisplayTruewind] = useState(trueWind);
  const cumulativeTruewindRef = useRef(trueWind);

  const [displayApparent, setDisplayApparent] = useState(apparentWind);
  const cumulativeApparentRef = useRef(apparentWind);

  function unwrapAngle(prev: number, raw: number): number {
    let delta = raw - (prev % 360);

    if (delta > 180) {
      delta -= 360;
    }
    if (delta < -180) {
      delta += 360;
    }

    return prev + delta;
  }

  useEffect(() => {
    const prev = cumulativeHeadingRef.current;
    const next = unwrapAngle(prev, shipHeading);
    cumulativeHeadingRef.current = next;
    setDisplayHeading(next);
  }, [shipHeading]);

  useEffect(() => {
    const prev = cumulativeTruewindRef.current;
    const next = unwrapAngle(prev, trueWind);
    cumulativeTruewindRef.current = next;
    setDisplayTruewind(next);
  }, [trueWind]);

  useEffect(() => {
    const prev = cumulativeApparentRef.current;
    const next = unwrapAngle(prev, apparentWind);
    cumulativeApparentRef.current = next;
    setDisplayApparent(next);
  }, [apparentWind]);

  // === Colors ===
  const colors = {
    text: theme.visualization.getColorByName(options.textColor || '#111827'),
    dial: theme.visualization.getColorByName(options.dialColor || 'white'),
    bezel: theme.visualization.getColorByName(options.bezelColor || '#c6c6c6'),
    ship: theme.visualization.getColorByName(options.shipColor || 'red'),
    trueWind: theme.visualization.getColorByName(options.trueWindColor || 'blue'),
    apparentWind: theme.visualization.getColorByName(options.apparentWindColor || 'yellow'),
  };

  // === Helpers ===
  const polarToCartesian = (r: number, angleRad: number) => ({
    x: r * Math.sin(angleRad),
    y: -r * Math.cos(angleRad),
  });

  const renderTicks = (
    count: number,
    innerFrac: number,
    outerFrac: number,
    skip?: (i: number) => boolean,
    stroke = colors.text,
    strokeWFrac = 0.01
  ) =>
    Array.from({ length: count }).map((_, i) => {
      if (skip?.(i)) {
        return null;
      }
      const angle = (i * (360 / count) * Math.PI) / 180;
      const p1 = polarToCartesian(radius * outerFrac, angle);
      const p2 = polarToCartesian(radius * innerFrac, angle);
      return (
        <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={stroke} strokeWidth={radius * strokeWFrac} />
      );
    });

  // === Ship (needle) ===
  const renderShip = () => {
    const shipHeight = 45;
    const scale = (radius * 0.9) / shipHeight;
    const strokeW = Math.max(0.5, radius * 0.005);
    return (
      <g transform={`scale(${scale})`}>
        <path
          d="M 0 -30 Q 8 -25 8 0 L 8 23 Q 8 25 0 25 Q -8 25 -8 23 L -8 0 Q -8 -25 0 -30 Z"
          fill={colors.ship}
          stroke={colors.text}
          strokeWidth={strokeW}
        />
      </g>
    );
  };

  // === Wind arrows ===
  const renderWindArrow = (angleDeg: number, color: string, label: string) => {
    const rOuter = radius * 0.9;
    const rNotch = radius * 0.85;
    const rInner = radius * 0.4;
    const rText = radius * 0.75;
    const rwidthRad = 0.2;

    const angleRad = (angleDeg * Math.PI) / 180;
    const pNotch = polarToCartesian(rNotch, angleRad);
    const pOuter1 = polarToCartesian(rOuter, angleRad - rwidthRad / 2);
    const pOuter2 = polarToCartesian(rOuter, angleRad + rwidthRad / 2);
    const pInner = polarToCartesian(rInner, angleRad);
    const pText = polarToCartesian(rText, angleRad);

    return (
      <g>
        <polygon
          points={`${pInner.x},${pInner.y} ${pOuter2.x},${pOuter2.y} ${pNotch.x},${pNotch.y} ${pOuter1.x},${pOuter1.y}`}
          fill={color}
          stroke={colors.text}
        />
        <text
          x={pText.x}
          y={pText.y + radius * 0.025}
          fontFamily="system-ui, sans-serif"
          fontSize={radius * 0.075}
          fill={colors.text}
          textAnchor="middle"
          fontWeight="600"
        >
          {label}
        </text>
      </g>
    );
  };

  // Early return if no data
  if (!data.series || data.series.length === 0) {
    return <PanelDataErrorView fieldConfig={fieldConfig} panelId={id} data={data} needsStringField />;
  }

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
        </marker>
      </defs>

      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {/* Outer bezel */}
        <circle cx={0} cy={0} r={radius * 0.98} fill={colors.bezel} stroke="#9ca3af" strokeWidth={radius * 0.01} />

        {/* Dial */}
        <circle cx={0} cy={0} r={radius * 0.88} fill={colors.dial} stroke={colors.text} strokeWidth={radius * 0.015} />

        {/* Ship */}
        <g
          transform={options.rotationMode === 'rotate-ship' ? `rotate(${displayHeading})` : undefined}
          style={options.rotationMode === 'rotate-ship' ? { transition: 'transform 0.6s ease-in-out' } : {}}
        >
          {renderShip()}
        </g>

        {/* Dial contents */}
        <g
          transform={options.rotationMode === 'rotate-dial' ? `rotate(${-displayHeading})` : undefined}
          style={options.rotationMode === 'rotate-dial' ? { transition: 'transform 0.6s ease-in-out' } : {}}
        >
          {options.showLabels && (
            <g
              fontFamily="system-ui, sans-serif"
              fontSize={radius * 0.12}
              fill={colors.text}
              textAnchor="middle"
              dominantBaseline="central"
              fontWeight="700"
            >
              {['N', 'E', 'S', 'W'].map((dir, i) => {
                const angle = (i * 90 * Math.PI) / 180;
                const { x, y } = polarToCartesian(radius * 0.8, angle);
                return (
                  <text key={dir} x={x} y={y}>
                    {dir}
                  </text>
                );
              })}
            </g>
          )}

          {renderTicks(48, 0.8, 0.86, (i) => i % 12 === 0)}
          {renderTicks(8, 0.72, 0.86, (i) => !!options.showLabels && [0, 2, 4, 6].includes(i), colors.text, 0.02)}
        </g>

        {/* Wind arrows */}
        <g
          transform={
            options.rotationMode === 'rotate-dial'
              ? `rotate(${displayApparent - displayHeading})`
              : `rotate(${displayApparent})`
          }
          style={{ transition: 'transform 0.6s ease-in-out' }}
        >
          {options.apparentWindField && apparentWind !== null && renderWindArrow(0, colors.apparentWind, 'A')}
        </g>
        <g
          transform={
            options.rotationMode === 'rotate-dial'
              ? `rotate(${displayTruewind - displayHeading})`
              : `rotate(${displayTruewind})`
          }
          style={{ transition: 'transform 0.6s ease-in-out' }}
        >
          {options.trueWindField && trueWind !== null && renderWindArrow(0, colors.trueWind, 'T')}
        </g>

        {/* Numeric heading */}
        {options.showHeadingValue && (
          <text
            x={0}
            y={radius * 0.65}
            fontFamily="system-ui, sans-serif"
            fontSize={radius * 0.15}
            fill={colors.text}
            textAnchor="middle"
            fontWeight="600"
            data-testid="windrose-numeric-heading"
          >
            {`${Math.round(((shipHeading % 360) + 360) % 360)}°`}
          </text>
        )}

        {options.showHeadingValue && options.trueWindField && (
          <text
            x={-radius * 0.6}
            y={radius * 0.95}
            fontFamily="system-ui, sans-serif"
            fontSize={radius * 0.15}
            fill={colors.trueWind}
            textAnchor="end"
            fontWeight="600"
            data-testid="windrose-numeric-truewind"
          >
            {`${Math.round(((trueWind % 360) + 360) % 360)}°`}
          </text>
        )}

        {options.showHeadingValue && options.apparentWindField && (
          <text
            x={radius * 0.6}
            y={radius * 0.95}
            fontFamily="system-ui, sans-serif"
            fontSize={radius * 0.15}
            fill={colors.apparentWind}
            textAnchor="start"
            fontWeight="600"
            data-testid="windrose-numeric-apparent"
          >
            {`${Math.round(((apparentWind % 360) + 360) % 360)}°`}
          </text>
        )}
      </g>
    </svg>
  );
};
