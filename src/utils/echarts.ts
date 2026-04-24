/**
 * ECharts 按需引入 — 仅引入项目中实际使用的组件
 * 可节省约 400KB+ 包体积（对比 import * as echarts from 'echarts'）
 *
 * 项目中实际使用的图表类型：line、bar
 * 实际使用的组件：Grid、Tooltip、Legend、Dataset、Graphic
 */
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GraphicComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  DataZoomComponent,
  TitleComponent,
} from 'echarts/components'

// 注册所需组件（只注册一次）
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GraphicComponent,
  MarkLineComponent,
  MarkPointComponent,
  MarkAreaComponent,
  DataZoomComponent,
  TitleComponent,
])

export { init, getInstanceByDom, graphic } from 'echarts/core'
export type { ECharts, EChartsOption } from 'echarts'
