import { PanelPlugin } from '@grafana/data';
import { WindrosePanel } from './components/WindrosePanel';
import { SimpleOptions } from './types';

export const plugin = new PanelPlugin<SimpleOptions>(WindrosePanel).setPanelOptions((builder) => {
  return builder
    .addFieldNamePicker({
      path: 'headingField',
      name: 'Heading Field',
      description: 'Select which field contains the heading value',
      defaultValue: '',
    })
    .addFieldNamePicker({
      path: 'trueWindField',
      name: 'Truewind Field',
      description: 'Select which field contains the true wind value',
      defaultValue: '',
    })
    .addFieldNamePicker({
      path: 'apparentWindField',
      name: 'Apparent wind Field',
      description: 'Select which field contains the apparent wind value',
      defaultValue: '',
    })
    .addColorPicker({
      path: 'textColor',
      name: 'Text Color',
      category: ['Coloring'],
      description: 'Color of the text and tick marks',
      defaultValue: '#111827',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'shipColor',
      name: 'Ship Color',
      category: ['Coloring'],
      description: 'Color of the ship profile',
      defaultValue: 'red',
      showIf: (opts) => opts.needleType === 'ship',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'trueWindColor',
      name: 'True Wind Color',
      category: ['Coloring'],
      description: 'Color of the ship profile',
      defaultValue: 'blue',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'apparentWindColor',
      name: 'Apparent Wind Color',
      category: ['Coloring'],
      description: 'Color of the ship profile',
      defaultValue: 'yellow',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'dialColor',
      name: 'Dial Color',
      category: ['Coloring'],
      description: 'Background color of the windrose dial',
      defaultValue: 'white',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addColorPicker({
      path: 'bezelColor',
      name: 'Bezel Color',
      category: ['Coloring'],
      description: 'Outer ring color',
      defaultValue: '#c6c6c6',
      settings: { showAlpha: true, mode: 'hue' },
    })
    .addBooleanSwitch({
      path: 'showLabels',
      name: 'Show Cardinal Labels',
      description: 'Display N, E, S, W markers',
      defaultValue: true,
    })
    .addBooleanSwitch({
      path: 'showHeadingValue',
      name: 'Show Numeric Heading',
      description: 'Display the heading value in degrees',
      defaultValue: true,
    })
    .addSelect({
      path: 'needleType',
      name: 'Needle Type',
      description: 'Select the style for the windrose needle',
      defaultValue: 'ship',
      settings: {
        options: [
          { value: 'ship', label: 'Ship Outline' },
          { value: 'svg', label: 'Custom SVG' },
          { value: 'png', label: 'Custom PNG' },
        ],
      },
    })
    .addTextInput({
      path: 'needleSvg',
      name: 'Custom SVG URL / Base64',
      description: 'Provide a URL or data URI for a custom SVG needle',
      defaultValue: '',
      showIf: (opts) => opts.needleType === 'svg',
    })
    .addTextInput({
      path: 'needlePng',
      name: 'Custom PNG URL / Base64',
      description: 'Provide a URL or data URI for a custom PNG needle',
      defaultValue: '',
      showIf: (opts) => opts.needleType === 'png',
    })
    .addSelect({
      path: 'rotationMode',
      name: 'Orientation Mode',
      description: 'Choose whether to rotate the needle or the dial',
      settings: {
        options: [
          { value: 'rotate-ship', label: 'North Up' },
          { value: 'rotate-dial', label: 'Bow Up' },
        ],
      },
      defaultValue: 'rotate-ship',
    });
});
