// src/redux/slices/partnersSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Partner } from '@/types/partner';
import { PartnerDish } from '@/types/partner';
import { api } from '@/api/partnersApi';

// ================== Thunks для партнерів ==================
export const fetchPartners = createAsyncThunk<Partner[]>(
  'partners/fetchAll',
  async () => {
    const response = await api.getPartners();
    return response.data as Partner[];
  }
);

export const createNewPartner = createAsyncThunk<Partner, Partial<Partner>>(
  'partners/create',
  async (data) => {
    const response = await api.createPartner(data);
    return response.data as Partner;
  }
);

export const updatePartnerById = createAsyncThunk<Partner, { id: string; data: Partial<Partner> }>(
  'partners/update',
  async ({ id, data }) => {
    const response = await api.updatePartner(id, data);
    return response.data as Partner;
  }
);

export const deletePartnerById = createAsyncThunk<string, string>(
  'partners/delete',
  async (id) => {
    await api.deletePartner(id);
    return id;
  }
);

// ================== Thunks для страв партнера ==================
export const fetchPartnerMenu = createAsyncThunk<{ partnerId: string; dishes: PartnerDish[] }, string>(
  'partnerDishes/fetchMenu',
  async (partnerId) => {
    const response = await api.getPartnerMenu(partnerId);
    return { partnerId, dishes: response.data as PartnerDish[] };
  }
);

export const addPartnerDish = createAsyncThunk<PartnerDish, Partial<PartnerDish>>(
  'partnerDishes/add',
  async (data) => {
    const response = await api.addPartnerDish(data);
    return response.data as PartnerDish;
  }
);

export const updatePartnerDish = createAsyncThunk<PartnerDish, { id: string; data: Partial<PartnerDish> }>(
  'partnerDishes/update',
  async ({ id, data }) => {
    const response = await api.updatePartnerDish(id, data);
    return response.data as PartnerDish;
  }
);

export const deletePartnerDish = createAsyncThunk<string, string>(
  'partnerDishes/delete',
  async (id) => {
    await api.deletePartnerDish(id);
    return id;
  }
);

// ================== Slice ==================
interface PartnersState {
  partners: Partner[];
  partnerDishes: PartnerDish[];
  selectedPartnerId: string | null;
  loading: boolean;
  error?: string;
}

const initialState: PartnersState = {
  partners: [],
  partnerDishes: [],
  selectedPartnerId: null,
  loading: false,
};

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {
    setSelectedPartner(state, action: PayloadAction<string>) {
      state.selectedPartnerId = action.payload;
    },
    clearSelectedPartner(state) {
      state.selectedPartnerId = null;
    },
  },
  extraReducers: (builder) => {
    // --- Партнери ---
    builder
      .addCase(fetchPartners.pending, (state) => { state.loading = true; })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.partners.push(action.payload);
      })
      .addCase(updatePartnerById.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.partners = state.partners.map(p => p.id === action.payload.id ? action.payload : p);
      })
      .addCase(deletePartnerById.fulfilled, (state, action: PayloadAction<string>) => {
        state.partners = state.partners.filter(p => p.id !== action.payload);
      });

    // --- Страви партнера ---
    builder
      .addCase(fetchPartnerMenu.fulfilled, (state, action: PayloadAction<{ partnerId: string; dishes: PartnerDish[] }>) => {
        state.partnerDishes = action.payload.dishes;
        state.selectedPartnerId = action.payload.partnerId;
      })
      .addCase(addPartnerDish.fulfilled, (state, action: PayloadAction<PartnerDish>) => {
        state.partnerDishes.push(action.payload);
      })
      .addCase(updatePartnerDish.fulfilled, (state, action: PayloadAction<PartnerDish>) => {
        state.partnerDishes = state.partnerDishes.map(d => d.id === action.payload.id ? action.payload : d);
      })
      .addCase(deletePartnerDish.fulfilled, (state, action: PayloadAction<string>) => {
        state.partnerDishes = state.partnerDishes.filter(d => d.id !== action.payload);
      });
  },
});

export const { setSelectedPartner, clearSelectedPartner } = partnersSlice.actions;
export default partnersSlice.reducer;
