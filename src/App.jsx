import Board from './components/Board';
import Column from './components/Column';
import NotionKanban from './components/NotionKanban';

function App() {
	return (
		<>
			<NotionKanban>
				<Board>
					<Column />
				</Board>
			</NotionKanban>
		</>
	);
}

export default App;
