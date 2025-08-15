import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Partner, PartnerDish } from '../../types/partner';
import { api } from '../../api/partners';

// --- Thunks для партнерів ---
export const fetchPartners = createAsyncThunk('partners/fetchAll', async () => {
  const response = await api.getPartners();
  return response.data;
});

export const createNewPartner = createAsyncThunk('partners/create', async (data: Partial<Partner>) => {
  const response = await api.createPartner(data);
  return response.data;
});

export const updatePartnerById = createAsyncThunk(
  'partners/update',
  async ({ id, data }: { id: string; data: Partial<Partner> }) => {
    const response = await api.updatePartner(id, data);
    return response.data;
  }
);

export const deletePartnerById = createAsyncThunk('partners/delete', async (id: string) => {
  await api.deletePartner(id);
  return id;
});

// --- Thunks для страв партнера ---
export const fetchPartnerMenu = createAsyncThunk('partnerDishes/fetchMenu', async (partnerId: string) => {
  const response = await api.getPartnerMenu(partnerId);
  return { partnerId, dishes: response.data };
});

export const addPartnerDish = createAsyncThunk('partnerDishes/add', async (data: Partial<PartnerDish>) => {
  const response = await api.addPartnerDish(data);
  return response.data;
});

export const updatePartnerDish = createAsyncThunk(
  'partnerDishes/update',
  async ({ id, data }: { id: string; data: Partial<PartnerDish> }) => {
    const response = await api.updatePartnerDish(id, data);
    return response.data;
  }
);

export const deletePartnerDish = createAsyncThunk('partnerDishes/delete', async (id: string) => {
  await api.deletePartnerDish(id);
  return id;
});

// --- Slice ---
interface PartnersState {
  partners: Partner[];
  partnerDishes: PartnerDish[];
  loading: boolean;
  error?: string;
}

const initialState: PartnersState = {
  partners: [],
  partnerDishes: [],
  loading: false,
};

const partnersSlice = createSlice({
  name: 'partners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Партнери ---
    builder
      .addCase(fetchPartners.pending, (state) => { state.loading = true; })
      .addCase(fetchPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.loading = false;
        state.partners = action.payload;
      })
      .addCase(fetchPartners.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

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
      .addCase(fetchPartnerMenu.fulfilled, (state, action) => {
        state.partnerDishes = action.payload.dishes;
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

export default partnersSlice.reducer;
