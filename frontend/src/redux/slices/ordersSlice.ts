import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, CreateOrderDto } from '@/types/order';
import { createOrderApi, fetchOrdersApi, deleteOrderApi, updateOrderStatusApi } from '@/api/orderApi';

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error?: string;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: undefined,
};

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData: CreateOrderDto) => {
  return await createOrderApi(orderData);
});

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  return await fetchOrdersApi();
});

export const deleteOrder = createAsyncThunk('orders/deleteOrder', async (orderNumber: string) => {
  return await deleteOrderApi(orderNumber);
});

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ orderNumber, status }: { orderNumber: string; status: string }) => {
    return await updateOrderStatusApi(orderNumber, status);
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Create Order
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(o => o.orderNumber !== action.meta.arg);
      })

      // Update Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const idx = state.orders.findIndex(o => o.orderNumber === action.payload.order.orderNumber);
        if (idx >= 0) state.orders[idx] = action.payload.order;
      });
  },
});

export default ordersSlice.reducer;
