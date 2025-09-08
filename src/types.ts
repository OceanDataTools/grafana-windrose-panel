export interface SimpleOptions {
  headingField?: string; // Ship heading
  trueWindField?: string; // True wind direction (0–360)
  apparentWindField?: string; // Apparent wind angle (relative or absolute)
  textColor?: string;
  shipColor?: string;
  trueWindColor?: string;
  apparentWindColor?: string;
  dialColor?: string;
  bezelColor?: string;
  showLabels?: boolean;
  showHeadingValue?: boolean;

  needleType?: 'ship' | 'svg' | 'png';
  needleSvg?: string;
  needlePng?: string;

  rotationMode?: 'rotate-ship' | 'rotate-dial';
}
