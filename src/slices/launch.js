import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { filters } from 'consts';

const initialState = {
  launches: [],
  totalLaunches: 0,
  isLoading: false,
};

const slice = createSlice({
  name: 'launch',
  initialState,
  reducers: {
    setLaunches(state, action) {
      state.launches = action.payload;
    },
    setTotalLaunches(state, action) {
      state.totalLaunches = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const reducer = slice.reducer;

export const setLoading = (isLoading) => async (dispatch) => {
  dispatch(slice.actions.setLoading(isLoading));
};

export const fetchLaunches =
  ({ page, launch, dateRange }) =>
  async (dispatch) => {
    dispatch(setLoading(true));
    let filterQuery = {};
    if (launch.value === filters[1].value)
      filterQuery = { ...filterQuery, upcoming: true };
    else if (launch.value === filters[2].value)
      filterQuery = { ...filterQuery, success: true };
    else if (launch.value === filters[3].value)
      filterQuery = { ...filterQuery, success: false };

    filterQuery = {
      ...filterQuery,
      date_unix: {
        $lte: Math.floor(dateRange.endDate / 1000),
        $gte: Math.floor(dateRange.startDate / 1000),
      },
    };

    const response = await axios
      .post('https://api.spacexdata.com/v4/launches/query', {
        query: filterQuery,
        options: {
          page,
          sort: '-date_unix',
          populate: ['launchpad', 'rocket', 'payloads'],
        },
      })
      .catch((error) => {
        console.log(error);
      });
    dispatch(setLoading(false));
    if (response) {
      dispatch(slice.actions.setLaunches(response?.data?.docs ?? []));
      dispatch(
        slice.actions.setTotalLaunches(response?.data?.totalPages ?? [])
      );
      return response;
    }
  };

export default slice;
