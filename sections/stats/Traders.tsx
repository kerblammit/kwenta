import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { useGetFuturesTradersStats } from 'queries/futures/useGetFuturesTradersStats';

import { initChart } from './initChart';
import type { EChartsOption } from './initChart';
import { ChartContainer, ChartWrapper } from './stats.styles';
import { TimeRangeSwitcher } from './TimeRangeSwitcher';

export const Traders = () => {
	const { t } = useTranslation();
	const theme = useTheme();

	const ref = useRef<HTMLDivElement | null>(null);

	// show 24h data by default
	const [is24H, setIs24H] = useState<boolean>(true);
	const [isWeek, setIsWeek] = useState<boolean>(false);
	const [isMonth, setIsMonth] = useState<boolean>(false);
	const [isMax, setIsMax] = useState<boolean>(false);

	const { chart, defaultOptions } = useMemo(() => {
		if (chart) chart.dispose();
		return initChart(ref?.current, theme);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ref?.current, theme]);

	const { data: rawData } = useGetFuturesTradersStats();

	const tradersData = useMemo(() => {
		if (is24H) {
			return rawData;
		} else if (isWeek) {
			// TODO
		} else if (isMonth) {
			// TODO
		} else if (isMax) {
			// TODO
		}
	}, [is24H, isMax, isMonth, isWeek, rawData]);

	useEffect(() => {
		if (!ref || !chart || !ref.current || !tradersData || !tradersData.length) {
			return;
		}

		const text = t('stats.traders.title');

		const data: any = [];
		tradersData?.forEach(({ date }) => data.push(date));
		const option: EChartsOption = {
			title: {
				text,
				left: 20,
				top: 40,
				itemGap: 10,
				textStyle: {
					color: theme.colors.common.primaryWhite,
					fontFamily: theme.fonts.regular,
					fontSize: 18,
				},
			},
			grid: {
				top: 137,
				bottom: 40,
			},
			xAxis: {
				type: 'category',
				data,
				axisLabel: {
					color: '#ECE8E3',
				},
				axisTick: {
					show: false,
				},
			},
			yAxis: [
				{
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#C9975B',
						},
					},
					axisLabel: {
						formatter: (value: any) => {
							const val = Math.floor(value / 1000);
							return val + (val === 0 ? '' : 'K');
						},
					},
					position: 'right',
				},
				{
					type: 'value',
					splitLine: {
						lineStyle: {
							color: '#C9975B',
						},
					},
					max: 1000,
					show: false,
				},
			],
			tooltip: {
				show: true,
				backgroundColor: '#0C0C0C',
				extraCssText:
					'box-shadow: 0px 24px 40px rgba(0, 0, 0, 0.25), inset 0px 1px 0px rgba(255, 255, 255, 0.08), inset 0px 0px 20px rgba(255, 255, 255, 0.03);backdrop-filter: blur(60px);/* Note: backdrop-filter has minimal browser support */border-radius: 15px;',
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
				},
			},
			series: [
				{
					data: tradersData?.map((data) => data.totalUniqueTraders),
					type: 'bar',
					name: 'Unique Traders',
					itemStyle: {
						color: '#C9975B',
					},
				},
				{
					name: 'Traders by Period',
					type: 'line',
					data: tradersData?.map((data) => data.uniqueTradersByPeriod),
					lineStyle: {
						color: '#02E1FF',
						cap: 'square',
					},
					yAxisIndex: 1,
					symbol: 'none',
				},
			],
			legend: {
				icon: 'circle',
				top: 71,
				left: 20,
				textStyle: {
					color: theme.colors.common.primaryWhite,
					fontFamily: theme.fonts.regular,
					fontSize: 15,
				},
			},
		};

		chart.setOption(option);
	}, [ref, chart, t, tradersData, theme]);
	return (
		<ChartContainer width={1}>
			<TimeRangeSwitcher
				is24H={is24H}
				isWeek={isWeek}
				isMonth={isMonth}
				isMax={isMax}
				setIs24H={setIs24H}
				setIsWeek={setIsWeek}
				setIsMonth={setIsMonth}
				setIsMax={setIsMax}
			/>
			<ChartWrapper ref={ref} />
		</ChartContainer>
	);
};
