import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from 'state/store';

interface HeaderState {
    expand: boolean;
}

const initialState: HeaderState = {
    expand: false
};

// Slice
const headerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setExpand: (state, action: PayloadAction<boolean>) => {
            state.expand = action.payload;
        }
    }
});

// Reducers
export default headerSlice.reducer;

// Selectors
export const headerSelector = (state: RootState) => state.header;
export const headerExpandSelector = (state: RootState) => state.header.expand;

// Actions
const { setExpand } = headerSlice.actions;

// Thunks
export const toggleHeaderExpand = (payload?: boolean, ): AppThunk => 
(dispatch, getState) => dispatch(setExpand(payload !== undefined ? payload : !headerExpandSelector(getState())));