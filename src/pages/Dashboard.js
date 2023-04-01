import { useState, useEffect } from 'react';
import CustomTable from 'components/CustomTable';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Stack,
  Box,
  Container,
  Grid,
  Button,
  Menu,
  MenuItem,
  Backdrop,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { RiCalendarLine, RiFilterLine, RiArrowDownSLine } from 'react-icons/ri';
import { filters } from 'consts';
import { fetchLaunches } from 'slices/launch';
import { useSelector, useDispatch } from 'store';
import { DateRangePicker } from 'materialui-daterange-picker';
import moment from 'moment';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}));

export default function Dashboard() {
  const dispatch = useDispatch();
  const { search } = useLocation();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [launchFilter, setLaunchFilter] = useState(null);
  const [dateFilter, setDateFilter] = useState(null);
  const [datePicker, setDatePicker] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { launches, totalLaunches, isLoading } = useSelector(
    (state) => state.launch
  );

  const definedRanges = [
    {
      label: 'Past week',
      startDate: moment().subtract(1, 'weeks').startOf('week').toDate(),
      endDate: moment().subtract(1, 'weeks').endOf('week').toDate(),
    },
    {
      label: 'Past month',
      startDate: moment().subtract(1, 'months').startOf('month').toDate(),
      endDate: moment().subtract(1, 'months').endOf('month').toDate(),
    },
    {
      label: 'Past 2 months',
      startDate: moment().subtract(2, 'months').startOf('month').toDate(),
      endDate: moment().subtract(1, 'months').endOf('month').toDate(),
    },
    {
      label: 'Past 6 months',
      startDate: moment().subtract(6, 'months').startOf('month').toDate(),
      endDate: moment().subtract(1, 'months').endOf('month').toDate(),
    },
    {
      label: 'Past year',
      startDate: moment().subtract(1, 'years').startOf('year').toDate(),
      endDate: moment().subtract(1, 'years').endOf('year').toDate(),
    },
    {
      label: 'Past 2 years',
      startDate: moment().subtract(2, 'years').startOf('year').toDate(),
      endDate: moment().subtract(1, 'years').endOf('year').toDate(),
    },
  ];

  const useQuery = () => {
    return new URLSearchParams(search);
  };
  const query = useQuery();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDatePicker = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const menuItemClick = (event) => {
    handleClose();
    if (launchFilter.value !== event.target.value) setPage(1);
    setLaunchFilter(
      filters.find((filter) => filter.value === event.target.value)
    );
  };

  useEffect(() => {
    if (page && launchFilter && dateFilter) {
      const newQuery = new URLSearchParams();
      newQuery.append('page', page);
      newQuery.append('launch', launchFilter?.name);
      newQuery.append('from', new Date(dateFilter?.startDate).getTime());
      newQuery.append('to', new Date(dateFilter?.endDate).getTime());
      navigate(`?${newQuery}`, { replace: true });
      dispatch(
        fetchLaunches({ page, launch: launchFilter, dateRange: dateFilter })
      );
    }
  }, [page, launchFilter, dateFilter]);

  useEffect(() => {
    const queryPage = query.get('page');
    const queryLaunch = query.get('launch');
    const from = query.get('from');
    const to = query.get('to');
    setPage(queryPage === '' ? 1 : queryPage ?? 1);
    setLaunchFilter(
      filters.find(
        (filter) =>
          filter.name ===
          (queryLaunch === ''
            ? filters[0].name
            : queryLaunch ?? filters[0].name)
      )
    );
    const startDate =
      from === ''
        ? definedRanges[3].startDate
        : parseInt(from)
          ? new Date(parseInt(from))
          : definedRanges[3].startDate;
    const endDate =
      to === ''
        ? definedRanges[3].endDate
        : parseInt(to)
          ? new Date(parseInt(to))
          : definedRanges[3].endDate;

    let label = 'Custom';

    definedRanges.forEach((range) => {
      if (
        range.startDate.getTime() === startDate.getTime() &&
        range.endDate.getTime() === endDate.getTime()
      )
        label = range.label;
    });

    setDateFilter({
      label,
      startDate,
      endDate,
    });
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popover' : undefined;

  return (
    <Container>
      <Box>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button
              sx={{
                textTransform: 'none',
                color: '#4B5563',
              }}
              startIcon={<RiCalendarLine />}
              endIcon={<RiArrowDownSLine />}
              onClick={toggleDatePicker}
            >
              {dateFilter?.label ?? 'Custom'}
            </Button>
          </Grid>
          <Grid item>
            <Button
              sx={{
                textTransform: 'none',
                color: '#4B5563',
              }}
              aria-describedby={id}
              startIcon={<RiFilterLine />}
              endIcon={<RiArrowDownSLine />}
              onClick={handleClick}
            >
              {launchFilter?.name}
            </Button>
            <StyledMenu
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {filters.map((filter) => (
                <MenuItem
                  key={filter.value}
                  value={filter.value}
                  onClick={menuItemClick}
                  disableRipple
                >
                  {filter.name}
                </MenuItem>
              ))}
            </StyledMenu>
          </Grid>
        </Grid>
        <Box py={4}>
          <CustomTable
            isLoading={isLoading}
            launches={launches}
            setPage={setPage}
            page={parseInt(page ?? 1)}
            totalPages={totalLaunches}
          />
        </Box>
      </Box>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={datePickerOpen}
      >
        {datePickerOpen && (
          <Stack>
            <DateRangePicker
              open={datePickerOpen}
              toggle={toggleDatePicker}
              initialDateRange={dateFilter}
              onChange={(range) => setDatePicker(range)}
              definedRanges={definedRanges}
            />
            <Divider />
            <Box
              py={2}
              textAlign="right"
              style={{
                background: 'white',
              }}
            >
              <Button variant="outlined" onClick={toggleDatePicker}>
                Cancel
              </Button>
              <Button
                sx={{
                  margin: '0 16px',
                }}
                variant="contained"
                onClick={() => {
                  setDateFilter(datePicker);
                  toggleDatePicker();
                }}
              >
                Apply
              </Button>
            </Box>
          </Stack>
        )}
      </Backdrop>
    </Container>
  );
}
