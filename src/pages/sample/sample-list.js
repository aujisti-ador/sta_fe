import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState, Fragment } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import {
  Button,
  Chip,
  Dialog,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import NumberFormat from 'react-number-format';
import { useFilters, useExpanded, useGlobalFilter, useRowSelect, useSortBy, useTable, usePagination } from 'react-table';

// project import
import UserView from 'sections/apps/profiles/user-list/UserView';
import AddUser from 'sections/apps/profiles/user-list/AddUser';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import MainCard from 'components/MainCard';
import ScrollX from 'components/ScrollX';
import makeData from 'data/react-table';
import { renderFilterTypes, GlobalFilter } from 'utils/react-table';
import { HeaderSort, IndeterminateCheckbox, SortingSelect, TablePagination, TableRowSelection } from 'components/third-party/ReactTable';

// assets
import { CloseOutlined, PlusOutlined, EyeTwoTone, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { getAllSampleList } from '_api/sample-api';

const avatarImage = require.context('assets/images/users', true);

// ==============================|| REACT TABLE ||============================== //

function ReactTable({ columns, data, getHeaderProps, renderRowSubComponent, paginationData, fetchData, handleAdd }) {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const filterTypes = useMemo(() => renderFilterTypes, []);
  const sortBy = { id: 'fatherName', desc: false };
  const [spageIndex, setSpageIndex] = useState(0);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setHiddenColumns,
    allColumns,
    visibleColumns,
    rows,
    // @ts-ignore
    page,
    // @ts-ignore
    gotoPage,
    // @ts-ignore
    setPageSize,
    // @ts-ignore
    state: { globalFilter, selectedRowIds, pageIndex, pageSize },
    // @ts-ignore
    preGlobalFilteredRows,
    // @ts-ignore
    setGlobalFilter,
    // @ts-ignore
    setSortBy,
    // gotoPage,
    // setPageSize,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      // @ts-ignore
      filterTypes,
      // @ts-ignore
      initialState: { pageIndex: spageIndex, pageSize: 10, hiddenColumns: [], sortBy: [sortBy] }
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect
  );


  useEffect(() => {
    if (matchDownSM) {
      setHiddenColumns([]);
    } else {
      setHiddenColumns([]);
    }
    // eslint - disable - next - line
  }, [matchDownSM]);

  console.log("===> data ", data)
  console.log("===> spageIndex ", spageIndex)

  const handleServerPagination = (e, v) => {
    console.log("handleServerPagination", e, v);
    fetchData(v - 1, 10)
    // setSpageIndex(v - 1);
    setSpageIndex(0);
  }

  return (
    <>
      {/* <TableRowSelection selected={Object.keys(selectedRowIds).length} /> */}
      <Stack spacing={3}>
        <Stack
          direction={matchDownSM ? 'column' : 'row'}
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 3, pb: 0 }}
        >
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            size="small"
          />
          <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
            {/* <SortingSelect sortBy={sortBy.id} setSortBy={setSortBy} allColumns={allColumns} /> */}
            <Button variant="contained" startIcon={<PlusOutlined />} onClick={handleAdd}>
              Add User
            </Button>
          </Stack>
        </Stack>

        <Table {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup, i) => (
              <TableRow key={i} {...headerGroup.getHeaderGroupProps()} sx={{ '& > th:first-of-type': { width: '58px' } }}>
                {headerGroup.headers.map((column, index) => (
                  <TableCell key={index} {...column.getHeaderProps([{ className: column.className }, getHeaderProps(column)])}>
                    <HeaderSort column={column} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              const rowProps = row.getRowProps();

              return (
                <Fragment key={i}>
                  <TableRow
                    {...row.getRowProps()}
                    onClick={() => {
                      row.toggleRowSelected();
                    }}
                    sx={{ cursor: 'pointer', bgcolor: row.isSelected ? alpha(theme.palette.primary.lighter, 0.35) : 'inherit' }}
                  >
                    {row.cells.map((cell, index) => (
                      <TableCell key={index} {...cell.getCellProps([{ className: cell.column.className }])}>
                        {cell.render('Cell')}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.isExpanded && renderRowSubComponent({ row, rowProps, visibleColumns })}
                </Fragment>
              );
            })}
            <TableRow sx={{ '&:hover': { bgcolor: 'transparent !important' } }}>
              <TableCell sx={{ p: 2, py: 3 }} colSpan={9}>
                <TablePagination handleServerPagination={handleServerPagination} totalPages={paginationData?.totalPages} gotoPage={gotoPage} rows={rows} setPageSize={setPageSize} pageSize={pageSize} pageIndex={pageIndex} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Stack>
    </>
  );
}

ReactTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  getHeaderProps: PropTypes.func,
  handleAdd: PropTypes.func,
  renderRowSubComponent: PropTypes.any
};

const SampleList = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [pdata, setPdata] = useState({});

  // const data = useMemo(async () => await getAllSampleList().data, []);
  // const data = useMemo(() => makeData(200), []);

  const [user, setUser] = useState(null);
  const [add, setAdd] = useState(false);

  const fetchData = async (pageIndex, pageSize) => {
    try {
      const response = await getAllSampleList(pageIndex, pageSize);
      console.log("===> index", pageIndex, pageSize, response)
      setData(response.data);
      setPdata(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(0, 10); // Fetch initial data with pageIndex=0 and pageSize=10
  }, []);

  const handleAdd = () => {
    setAdd(!add);
    if (user && !add) setUser(null);
  };

  const columns = useMemo(
    () => [
      // {
      //   title: 'Row Selection',
      //   // eslint-disable-next-line
      //   Header: ({ getToggleAllPageRowsSelectedProps }) => <IndeterminateCheckbox indeterminate {...getToggleAllPageRowsSelectedProps()} />,
      //   accessor: 'selection',
      //   // eslint-disable-next-line
      //   Cell: ({ row }) => <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />,
      //   disableSortBy: true
      // },
      // {
      //   Header: '#',
      //   accessor: 'id',
      //   className: 'cell-center'
      // },
      // {
      //   Header: 'Name',
      //   accessor: 'fatherName',
      //   // eslint-disable-next-line
      //   Cell: ({ row }) => {
      //     // eslint-disable-next-line
      //     const { values } = row;
      //     return (
      //       <Stack direction="row" spacing={1.5} alignItems="center">
      //         {/* eslint-disable-next-line */}
      //         <Avatar alt="Avatar 1" size="sm" src={avatarImage(`./avatar-${!values.avatar ? 1 : values.avatar}.png`).default} />
      //         <Stack spacing={0}>
      //           {/* eslint-disable-next-line */}
      //           <Typography variant="subtitle1">{values.fatherName}</Typography>
      //           <Typography variant="caption" color="textSecondary">
      //             {/* eslint-disable-next-line */}
      //             {values.email}
      //           </Typography>
      //         </Stack>
      //       </Stack>
      //     );
      //   }
      // },
      // {
      //   Header: 'Avatar',
      //   accessor: 'avatar',
      //   disableSortBy: true
      // },
      {
        Header: 'Requisition Number',
        accessor: 'requisition_number'
      },
      {
        Header: 'Style Number',
        accessor: 'style_number'
      },
      {
        Header: 'Status',
        accessor: 'status'
      },
      {
        Header: 'Brand',
        accessor: 'brand.brand_name'
      },
      {
        Header: 'Stage',
        accessor: 'stage'
      },
      {
        Header: 'Created At',
        accessor: 'created_at'
      },
      // {
      //   Header: 'Contact',
      //   accessor: 'contact',
      //   // eslint-disable-next-line
      //   Cell: ({ value }) => <NumberFormat displayType="text" format="+1 (###) ###-####" mask="_" defaultValue={value} />
      // },
      // {
      //   Header: 'Age',
      //   accessor: 'age',
      //   className: 'cell-right'
      // },
      // {
      //   Header: 'Country',
      //   accessor: 'country'
      // },
      // {
      //   Header: 'Status',
      //   accessor: 'status',
      //   // eslint-disable-next-line
      //   Cell: ({ value }) => {
      //     switch (value) {
      //       case 'Complicated':
      //         return <Chip color="error" label="Rejected" size="small" variant="light" />;
      //       case 'Relationship':
      //         return <Chip color="success" label="Verified" size="small" variant="light" />;
      //       case 'Single':
      //       default:
      //         return <Chip color="info" label="Pending" size="small" variant="light" />;
      //     }
      //   }
      // },
      // {
      //   Header: 'Actions',
      //   className: 'cell-center',
      //   disableSortBy: true,
      //   // eslint-disable-next-line
      //   Cell: ({ row }) => {
      //     // eslint-disable-next-line
      //     const collapseIcon = row.isExpanded ? (
      //       <CloseOutlined style={{ color: theme.palette.error.main }} />
      //     ) : (
      //       <EyeTwoTone twoToneColor={theme.palette.secondary.main} />
      //     );
      //     return (
      //       <Stack direction="row" alignItems="center" justifyContent="center" spacing={0}>
      //         <Tooltip title="View">
      //           <IconButton
      //             color="secondary"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               // eslint-disable-next-line
      //               row.toggleRowExpanded();
      //             }}
      //           >
      //             {collapseIcon}
      //           </IconButton>
      //         </Tooltip>
      //         <Tooltip title="Edit">
      //           <IconButton
      //             color="primary"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //               // eslint-disable-next-line
      //               setUser(row.values);
      //               handleAdd();
      //             }}
      //           >
      //             <EditTwoTone twoToneColor={theme.palette.primary.main} />
      //           </IconButton>
      //         </Tooltip>
      //         <Tooltip title="Delete">
      //           <IconButton
      //             color="error"
      //             onClick={(e) => {
      //               e.stopPropagation();
      //             }}
      //           >
      //             <DeleteTwoTone twoToneColor={theme.palette.error.main} />
      //           </IconButton>
      //         </Tooltip>
      //       </Stack>
      //     );
      //   }
      // }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  );

  const renderRowSubComponent = useCallback(({ row }) => <UserView data={data[row.id]} />, [data]);

  return (
    <MainCard content={false}>
      <ScrollX>
        <ReactTable
          columns={columns}
          data={data}
          paginationData={pdata}
          fetchData={fetchData}
          handleAdd={handleAdd}
          getHeaderProps={(column) => column.getSortByToggleProps()}
        // renderRowSubComponent={renderRowSubComponent}
        />
      </ScrollX>

      {/* add user dialog */}
      <Dialog maxWidth="sm" fullWidth onClose={handleAdd} open={add} sx={{ '& .MuiDialog-paper': { p: 0 } }}>
        {add && <AddUser user={user} onCancel={handleAdd} />}
      </Dialog>
    </MainCard>
  );
};

export default SampleList;
