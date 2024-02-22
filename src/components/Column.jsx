/* eslint-disable react/prop-types */
import { useState } from 'react';
import Card from './Card';
import { DropIndicator } from './DropIndicator';
import AddCard from './AddCard';

const Column = ({ title, headingColor, column, cards, setCards }) => {
	// State for active state during drag-and-drop
	const [active, setActive] = useState(false);

	//Drag start handler for the cards
	const handleDragStart = (e, card) => {
		e.dataTransfer.setData('cardId', card.id);
	};

	//Drag Over handler, highlights drop indicator
	const handleDragOver = (e) => {
		highlightIndicator(e);
		e.preventDefault();
		setActive(true);
	};

	//Highlight the nearest indicator to the current drag position
	const highlightIndicator = (e) => {
		const indicators = getIndicators();
		clearHighLights(indicators);
		const el = getNearestIndicator(e, indicators);
		el.element.style.opacity = '1';
	};

	//Clear hihglights on all drop indicators
	const clearHighLights = (els) => {
		const indicators = els || getIndicators();

		indicators.forEach((i) => {
			i.style.opacity = '0';
		});
	};

	// Finds the nearest drop indicator
	const getNearestIndicator = (e, indicators) => {
		const DISTANCE_OFFSET = 50;
		const el = indicators.reduce(
			(closest, child) => {
				const box = child.getBoundingClientRect();
				const offset = e.clientY - (box.top + DISTANCE_OFFSET);

				if (offset < 0 && offset > closest.offset) {
					return { offset: offset, element: child };
				} else {
					return closest;
				}
			},
			{
				offset: Number.NEGATIVE_INFINITY,
				element: indicators[indicators.length - 1],
			}
		);
		return el;
	};

	//Retrieves all drop indicators for the column
	const getIndicators = () => {
		return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
	};

	// Reset active state and clears highlights
	const handleDragLeave = () => {
		setActive(false);
		clearHighLights();
	};

	//Updates card order based on drop position
	const handleDragEnd = (e) => {
		setActive(false);
		clearHighLights();

		const cardId = e.dataTransfer.getData('cardId');

		const indicators = getIndicators();
		const { element } = getNearestIndicator(e, indicators);

		const before = element.dataset.before || '-1';

		if (before !== cardId) {
			let copy = [...cards];

			let cardToTransfer = copy.find((c) => c.id === cardId);

			if (!cardToTransfer) return;

			cardToTransfer = { ...cardToTransfer, column };

			copy = copy.filter((c) => c.id !== cardId);

			const moveToBack = before === '-1';

			if (moveToBack) {
				copy.push(cardToTransfer);
			} else {
				const insertAtIndex = copy.findIndex((el) => el.id === before);
				if (insertAtIndex === undefined) return;

				copy.splice(insertAtIndex, 0, cardToTransfer);
			}

			setCards(copy);
		}
	};

	const filteredCards = cards.filter((c) => c.column === column);

	return (
		<div className='w-56 shrink-0'>
			<div className='mb-3 flex items-center justify-between'>
				<h3 className={`font-medium ${headingColor}`}>{title}</h3>
				<span className='rounded text-sm text-neutral-400'>
					{filteredCards.length}
				</span>
			</div>
			<div
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDragEnd}
				className={`h-full w-full transition-colors ${
					active ? 'bg-neutral-800/50' : 'bg-neutral-800/0'
				}`}
			>
				{filteredCards.map((c) => {
					return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
				})}
				<DropIndicator beforeId='-1' column={column} />
				<AddCard column={column} setCards={setCards} />
			</div>
		</div>
	);
};

export default Column;
