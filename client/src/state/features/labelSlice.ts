import { Label } from "@/types/models/label.types";
import { createSlice } from "@reduxjs/toolkit";

export const initialState: {
    labelsList: Label[];
    label?: Label;
    addLabelModal: boolean;
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
} = {
    labelsList: [],
    label: undefined,
    addLabelModal: false,
    page: 0,
    size: 10,
    totalCount: 0,
    totalPages: 0,
}

export const labelSlice = createSlice({
    name: 'label',
    initialState,
    reducers: {
        setLabelsList: (state, action) => {
            state.labelsList = action.payload;
        },
        setLabel: (state, action) => {
            state.label = action.payload;
        },
        setAddLabelModal: (state, action) => {
            state.addLabelModal = action.payload;
        },
        setLabelPage: (state, action) => {
            state.page = action.payload;
        },
        setLabelSize: (state, action) => {
            state.size = action.payload;
        },
        setLabelTotalCount: (state, action) => {
            state.totalCount = action.payload;
        },
        setLabelTotalPages: (state, action) => {
            state.totalPages = action.payload;
        },
    },
});

export default labelSlice.reducer;

export const {
  setLabelsList,
  setLabel,
  setAddLabelModal,
  setLabelPage,
  setLabelSize,
  setLabelTotalCount,
  setLabelTotalPages,
} = labelSlice.actions;
