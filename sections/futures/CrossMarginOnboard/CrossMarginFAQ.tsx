import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function CrossMarginFAQ() {
	const { t } = useTranslation();

	const onClick = () => {
		// TODO: Open faq content
	};

	return (
		<ul>
			<FAQListItem>
				<div>{t('futures.modals.onboard.faq1')}</div>
				<div>↗</div>
			</FAQListItem>
			<FAQListItem>
				<div>{t('futures.modals.onboard.faq2')}</div>
				<div>↗</div>
			</FAQListItem>
			<FAQListItem>
				<div>{t('futures.modals.onboard.faq3')}</div>
				<div>↗</div>
			</FAQListItem>
		</ul>
	);
}

const FAQListItem = styled.ul`
	margin: 5px 0;
	cursor: pointer;
	display: flex;
	justify-content: space-between;
	&:hover {
		color: ${(props) => props.theme.colors.selectedTheme.text.value};
	}
`;
