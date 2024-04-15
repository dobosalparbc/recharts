import React from 'react';
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Cursor, CursorConnectedProps, CursorInternal, CursorProps } from '../../src/component/Cursor';
import { Tooltip, TooltipProps } from '../../src/component/Tooltip';
import { assertNotNull } from '../helper/assertNotNull';
import { RechartsRootState } from '../../src/state/store';
import { RechartsStoreProvider } from '../../src/state/RechartsStoreProvider';
import { LayoutContext } from '../../src/context/chartLayoutContext';
import { TooltipContextProvider, TooltipContextValue } from '../../src/context/tooltipContext';

function getTooltipElement(props: TooltipProps<any, any>) {
  return <Tooltip {...props} />;
}

const defaultProps: CursorProps = {
  element: getTooltipElement({}),
  tooltipEventType: 'axis',
};

const tooltipContext: TooltipContextValue = {
  label: '',
  payload: [],
  coordinate: {
    x: 0,
    y: 0,
  },
  active: true,
  index: 0,
};

const connectedProps: CursorConnectedProps = {
  chartName: '',
  layout: undefined,
  offset: undefined,
  tooltipAxisBandSize: 0,
  ...tooltipContext,
  ...defaultProps,
};

const preloadedState: Partial<RechartsRootState> = {
  options: { chartName: '' },
};

describe('Cursor', () => {
  describe('Internal component', () => {
    it('should render a custom cursor', () => {
      function MyCustomCursor() {
        return <p>I am a cursor.</p>;
      }
      const props: CursorConnectedProps = {
        ...connectedProps,
        element: getTooltipElement({ cursor: <MyCustomCursor /> }),
      };
      const { getByText } = render(
        <TooltipContextProvider value={tooltipContext}>
          <svg width={100} height={100}>
            <CursorInternal {...props} />
          </svg>
        </TooltipContextProvider>,
      );
      expect(getByText('I am a cursor.')).toBeVisible();
    });

    it('should render rectangle cursor for bar chart', () => {
      const props: CursorConnectedProps = {
        layout: 'horizontal',
        ...defaultProps,
        tooltipAxisBandSize: 1,
        chartName: 'BarChart',
        offset: { top: 0, height: 0 },
        ...tooltipContext,
      };
      const { container } = render(
        <svg width={100} height={100}>
          <CursorInternal {...props} />
        </svg>,
      );
      const cursor = container.querySelector('.recharts-rectangle');
      assertNotNull(cursor);
      expect(cursor).toBeVisible();
    });

    it('should render sector cursor for radial layout charts', () => {
      const radialTooltipContext: TooltipContextValue = {
        ...tooltipContext,
        coordinate: {
          endAngle: 2,
          radius: 1,
          startAngle: 1,
          x: 0,
          y: 0,
        },
      };
      const props: CursorConnectedProps = {
        chartName: '',
        offset: {},
        tooltipAxisBandSize: 0,
        ...defaultProps,
        layout: 'radial',
        ...radialTooltipContext,
      };
      const { container } = render(
        <svg width={100} height={100}>
          <CursorInternal {...props} />
        </svg>,
      );
      const cursor = container.querySelector('.recharts-sector');
      assertNotNull(cursor);
      expect(cursor).toBeVisible();
    });
  });

  describe('Connected component', () => {
    it('should render curve cursor by default', () => {
      const { container } = render(
        <RechartsStoreProvider preloadedState={preloadedState}>
          <TooltipContextProvider value={tooltipContext}>
            <svg width={100} height={100}>
              <Cursor {...defaultProps} />
            </svg>
          </TooltipContextProvider>
        </RechartsStoreProvider>,
      );
      const cursor = container.querySelector('.recharts-curve');
      assertNotNull(cursor);
      expect(cursor).toBeVisible();
    });

    it('should render a custom cursor', () => {
      function MyCustomCursor() {
        return <p>I am a cursor.</p>;
      }
      const props: CursorProps = {
        ...defaultProps,
        element: getTooltipElement({ cursor: <MyCustomCursor /> }),
      };
      const { getByText } = render(
        <RechartsStoreProvider preloadedState={preloadedState}>
          <TooltipContextProvider value={tooltipContext}>
            <svg width={100} height={100}>
              <Cursor {...props} />
            </svg>
          </TooltipContextProvider>
        </RechartsStoreProvider>,
      );
      expect(getByText('I am a cursor.')).toBeVisible();
    });

    it('should render cross cursor for scatter chart', () => {
      const preloadedScatterState: Partial<RechartsRootState> = {
        ...preloadedState,
        options: {
          chartName: 'ScatterChart',
        },
      };
      const { container } = render(
        <RechartsStoreProvider preloadedState={preloadedScatterState}>
          <TooltipContextProvider value={tooltipContext}>
            <svg width={100} height={100}>
              <Cursor {...defaultProps} />
            </svg>
          </TooltipContextProvider>
        </RechartsStoreProvider>,
      );
      const cursor = container.querySelector('.recharts-cross');
      assertNotNull(cursor);
      expect(cursor).toBeVisible();
    });

    it('should render sector cursor for radial layout charts', () => {
      const radialTooltipContext: TooltipContextValue = {
        ...tooltipContext,
        coordinate: {
          endAngle: 2,
          radius: 1,
          startAngle: 1,
          x: 0,
          y: 0,
        },
      };
      const { container } = render(
        <LayoutContext.Provider value="radial">
          <RechartsStoreProvider preloadedState={preloadedState}>
            <TooltipContextProvider value={radialTooltipContext}>
              <svg width={100} height={100}>
                <Cursor {...defaultProps} />
              </svg>
            </TooltipContextProvider>
          </RechartsStoreProvider>
        </LayoutContext.Provider>,
      );
      const cursor = container.querySelector('.recharts-sector');
      assertNotNull(cursor);
      expect(cursor).toBeVisible();
    });
  });
});
