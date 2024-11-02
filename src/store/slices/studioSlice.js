import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { studioApi } from '../../api/axios';

// Fetch all studios
export const fetchStudios = createAsyncThunk(
  '/api/studios/getStudios',
  async (filters) => {
    const response = await studioApi.get('/api/studios/getStudios', { params: filters });
    console.log(`response---------------`,response)
    return response.data.studios;
  }
);

// Fetch single studio by ID
export const fetchStudioById = createAsyncThunk(
  'studio/fetchById',
  async (id) => {
    const response = await studioApi.get(`/api/studios/getStudio/${id}`);
    console.log(response)
    return response.data;
  }
);

// Add new studio
export const addStudio = createAsyncThunk(
  'studio/addStudio',
  async (studioData) => {
    const response = await studioApi.post('/api/studios/createStudio', studioData);
    console.log(`response---------`,response)
    return response.data;
  }
);

// Update studio
export const updateStudio = createAsyncThunk(
  'studio/updateStudio',
  async ({ id, studioData }) => {
    const response = await studioApi.put(`/api/studios/updateStudio/${id}`, studioData);
    return response.data;
  }
);

// Delete studio
export const deleteStudio = createAsyncThunk(
  'studio/deleteStudio',
  async (id) => {
    await studioApi.delete(`/api/studios/deleteStudio/${id}`);
    return id;
  }
);

const studioSlice = createSlice({
  name: 'studio',
  initialState: {
    studios: [],
    currentStudio: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentStudio: (state) => {
      state.currentStudio = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Studios
      .addCase(fetchStudios.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudios.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = action.payload;
      })
      .addCase(fetchStudios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Studio
      .addCase(fetchStudioById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudioById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudio = action.payload;
      })
      .addCase(fetchStudioById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Add Studio
      .addCase(addStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.studios.push(action.payload);
      })
      .addCase(addStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Studio
      .addCase(updateStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudio = action.payload;
        const index = state.studios.findIndex(studio => studio._id === action.payload._id);
        if (index !== -1) {
          state.studios[index] = action.payload;
        }
      })
      .addCase(updateStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Studio
      .addCase(deleteStudio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudio.fulfilled, (state, action) => {
        state.loading = false;
        state.studios = state.studios.filter(studio => studio._id !== action.payload);
        if (state.currentStudio && state.currentStudio._id === action.payload) {
          state.currentStudio = null;
        }
      })
      .addCase(deleteStudio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearCurrentStudio, clearError } = studioSlice.actions;
export default studioSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import {studioApi} from '../../api/axios';

// export const fetchStudios = createAsyncThunk(
//   '/api/studios/getStudios',
//   async (filters) => {
//     const response = await studioApi.get('/api/studios/getStudios', { params: filters });
//     console.log(response)
//     return response.data.studios;
//   }
// );

// export const addStudio = createAsyncThunk(
//   'studio/addStudio',
//   async (studioData) => {
//     const response = await studioApi.post('/api/studios/createStudio', studioData);
//     return response.data;
//   }
// );

// const studioSlice = createSlice({
//   name: 'studio',
//   initialState: {
//     studios: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchStudios.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(fetchStudios.fulfilled, (state, action) => {
//         state.loading = false;
//         state.studios = action.payload;
//       })
//       .addCase(fetchStudios.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default studioSlice.reducer;