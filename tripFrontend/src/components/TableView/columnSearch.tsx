import { TableColumnType, Input, Space, Button, InputRef } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { RefObject } from 'react';
import Highlighter from 'react-highlight-words';
import { IoIosSearch } from 'react-icons/io';

const handleSearch = <T,>(
	selectedKeys: string[],
	confirm: FilterDropdownProps['confirm'],
	dataIndex: keyof T,
	setSearchText: (text: string) => void,
	setSearchedColumn: (text: string) => void,
): void => {
	confirm();
	setSearchText(selectedKeys[0]);
	setSearchedColumn(String(dataIndex));
};

const handleReset = (
	clearFilters: () => void,
	setSearchText: (text: string) => void,
): void => {
	clearFilters();
	setSearchText('');
};

export const getColumnSearchProps = <T,>(
	dataIndex: keyof T,
	searchInput: RefObject<InputRef | null>,
	searchText: string,
	setSearchText: (text: string) => void,
	searchedColumn: string,
	setSearchedColumn: (text: string) => void,
): TableColumnType<T> => ({
	filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
		<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
			<Input
				ref={searchInput}
				placeholder={`Search ${String(dataIndex)}`}
				value={selectedKeys[0]}
				onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
				onPressEnter={() =>
					handleSearch<T>(
						selectedKeys as string[],
						confirm,
						dataIndex,
						setSearchText,
						setSearchedColumn,
					)
				}
				style={{ marginBottom: 8, display: 'block' }}
			/>
			<Space>
				<Button
					type="primary"
					onClick={() =>
						handleSearch<T>(
							selectedKeys as string[],
							confirm,
							dataIndex,
							setSearchText,
							setSearchedColumn,
						)
					}
					size="small"
					style={{ width: 90 }}
				>
					Search
				</Button>
				<Button
					onClick={() =>
						clearFilters && handleReset(clearFilters, setSearchText)
					}
					size="small"
					style={{ width: 90 }}
				>
					Reset
				</Button>

				<Button
					type="link"
					size="small"
					onClick={() => {
						close();
					}}
				>
					close
				</Button>
			</Space>
		</div>
	),
	filterIcon: (filtered: boolean) => (
		<IoIosSearch style={{ color: filtered ? '#1677ff' : undefined }} />
	),
	onFilter: (value, record) =>
		record[dataIndex]
			?.toString()
			.toLowerCase()
			.includes((value as string).toLowerCase()) ?? false,
	filterDropdownProps: {
		onOpenChange(open): void {
			if (open) {
				searchInput.current?.select();
			}
		},
	},
	render: (text) =>
		searchedColumn === dataIndex ? (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[searchText]}
				autoEscape
				textToHighlight={text ? text.toString() : ''}
			/>
		) : (
			text
		),
});
