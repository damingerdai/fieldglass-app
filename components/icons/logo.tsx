import { createLucideIcon } from 'lucide-react';

export const LogoIcon = createLucideIcon('LogoIcon', [
  [
    'rect',
    {
      x: '5.25',
      y: '6.75',
      width: '13.5',
      height: '12.75',
      rx: '2.25',
      key: 'calendar-body'
    }
  ],
  [
    'path',
    {
      d: 'M8.25 4.5V6.75',
      key: 'calendar-pin-left'
    }
  ],
  [
    'path',
    {
      d: 'M15.75 4.5V6.75',
      key: 'calendar-pin-right'
    }
  ],
  [
    'path',
    {
      d: 'M8.25 10.5H15.75',
      key: 'note-line-1'
    }
  ],
  [
    'path',
    {
      d: 'M8.25 14.25H12.75',
      key: 'note-line-2'
    }
  ]
]);
