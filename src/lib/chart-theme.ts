import { Chart, registerables, type ChartConfiguration } from 'chart.js';

Chart.register(...registerables);

/**
 * Chart colours come from the site's CSS tokens (src/styles/global.css), so
 * charts follow the same light/dark palette as the rest of the page.
 */
export interface ChartTheme {
  accent: string;
  amber: string;
  rose: string;
  violet: string;
  emerald: string;
  slate: string;
  stone: string;
  grid: string;
  tick: string;
  ink: string;
  paper: string;
  rule: string;
  /** Returns the colour with the given alpha, as an rgba() string. */
  alpha: (color: string, a: number) => string;
}

const darkQuery = '(prefers-color-scheme: dark)';

function cssVar(styles: CSSStyleDeclaration, name: string): string {
  return styles.getPropertyValue(name).trim();
}

export function withAlpha(color: string, a: number): string {
  const hex = color.replace('#', '');
  if (/^[0-9a-f]{3}$/i.test(hex) || /^[0-9a-f]{6}$/i.test(hex)) {
    const full = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
    const n = parseInt(full, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }
  return color;
}

export function readChartTheme(): ChartTheme {
  const s = getComputedStyle(document.documentElement);
  return {
    accent: cssVar(s, '--color-chart-accent'),
    amber: cssVar(s, '--color-chart-amber'),
    rose: cssVar(s, '--color-chart-rose'),
    violet: cssVar(s, '--color-chart-violet'),
    emerald: cssVar(s, '--color-chart-emerald'),
    slate: cssVar(s, '--color-chart-slate'),
    stone: cssVar(s, '--color-chart-stone'),
    grid: cssVar(s, '--color-chart-grid'),
    tick: cssVar(s, '--color-chart-tick'),
    ink: cssVar(s, '--color-ink'),
    paper: cssVar(s, '--color-paper'),
    rule: cssVar(s, '--color-rule'),
    alpha: withAlpha,
  };
}

function applyDefaults(theme: ChartTheme) {
  const s = getComputedStyle(document.documentElement);
  Chart.defaults.font.family = cssVar(s, '--font-sans') || Chart.defaults.font.family;
  Chart.defaults.color = theme.tick;
  Chart.defaults.borderColor = theme.grid;
  const tooltip = Chart.defaults.plugins.tooltip;
  tooltip.backgroundColor = theme.ink;
  tooltip.titleColor = theme.paper;
  tooltip.bodyColor = theme.paper;
  tooltip.borderColor = theme.ink;
  tooltip.cornerRadius = 3;
}

/**
 * Draws a chart on the canvas with the given id using the current theme,
 * and redraws it when the reader's colour scheme changes.
 */
export function mountThemedChart(
  canvasId: string,
  build: (theme: ChartTheme) => ChartConfiguration,
): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  let chart: Chart | undefined;
  const draw = () => {
    const theme = readChartTheme();
    applyDefaults(theme);
    chart?.destroy();
    chart = new Chart(canvas, build(theme));
  };

  draw();

  const media = window.matchMedia(darkQuery);
  const onChange = () => {
    if (!canvas.isConnected) {
      media.removeEventListener('change', onChange);
      chart?.destroy();
      return;
    }
    draw();
  };
  media.addEventListener('change', onChange);
}
