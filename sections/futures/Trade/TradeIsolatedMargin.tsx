import Error from 'components/ErrorView';
import SegmentedControl from 'components/SegmentedControl';
import { DEFAULT_DELAYED_LEVERAGE_CAP, ISOLATED_MARGIN_ORDER_TYPES } from 'constants/futures';
import { changeLeverageSide } from 'state/futures/actions';
import { setOrderType } from 'state/futures/reducer';
import {
	selectFuturesAccount,
	selectFuturesType,
	selectLeverageSide,
	selectOrderType,
	selectPosition,
} from 'state/futures/selectors';
import { useAppDispatch, useAppSelector } from 'state/hooks';
import { selectPricesConnectionError } from 'state/prices/selectors';

import FeeInfoBox from '../FeeInfoBox';
import LeverageInput from '../LeverageInput';
import MarginInput from '../MarginInput';
import MarketInfoBox from '../MarketInfoBox';
import OrderSizing from '../OrderSizing';
import PositionButtons from '../PositionButtons';
import CreateAccount from '../TradeCrossMargin/CreateAccount';
import CrossMarginInfoBox from '../TradeCrossMargin/CrossMarginInfoBox';
import ManagePosition from './ManagePosition';
import TradePanelHeader from './TradePanelHeader';

type Props = {
	isMobile?: boolean;
};

const TradeIsolatedMargin = ({ isMobile }: Props) => {
	const dispatch = useAppDispatch();

	const leverageSide = useAppSelector(selectLeverageSide);
	const position = useAppSelector(selectPosition);
	const accountType = useAppSelector(selectFuturesType);
	const orderType = useAppSelector(selectOrderType);
	const pricesConnectionError = useAppSelector(selectPricesConnectionError);
	const account = useAppSelector(selectFuturesAccount);

	if (accountType === 'cross_margin' && !account) return <CreateAccount />;

	return (
		<div>
			<TradePanelHeader />
			{pricesConnectionError && (
				<Error message="Failed to connect to price feed. Please try disabling any ad blockers and refresh." />
			)}

			{!isMobile &&
				(accountType === 'isolated_margin' ? <MarketInfoBox /> : <CrossMarginInfoBox />)}

			{position?.position && position.position.leverage.gte(DEFAULT_DELAYED_LEVERAGE_CAP) && (
				<SegmentedControl
					styleType="check"
					values={ISOLATED_MARGIN_ORDER_TYPES}
					selectedIndex={ISOLATED_MARGIN_ORDER_TYPES.indexOf(orderType)}
					onChange={(oType: number) => {
						const newOrderType = oType === 1 ? 'market' : 'delayed_offchain';
						dispatch(setOrderType(newOrderType));
					}}
				/>
			)}
			<PositionButtons
				selected={leverageSide}
				onSelect={(side) => {
					dispatch(changeLeverageSide(side));
				}}
			/>

			{accountType === 'cross_margin' && <MarginInput />}

			<OrderSizing />

			<LeverageInput />

			<ManagePosition />

			<FeeInfoBox />
		</div>
	);
};

export default TradeIsolatedMargin;
