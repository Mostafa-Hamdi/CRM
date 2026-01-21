import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ClinicForm {
  clinicName: string;
  phone: string;
  email: string;
  address: string;
  adminFullName: string;
  adminEmail: string;
  adminPassword: string;
}

export interface SubscriptionState {
  currentStep: number;
  selectedPlanId: number | null;
  selectedAddonsIds: number[];
  clinicForm: ClinicForm;
}

const initialState: SubscriptionState = {
  currentStep: 1,
  selectedPlanId: null,
  selectedAddonsIds: [],
  clinicForm: {
    clinicName: "",
    phone: "",
    email: "",
    address: "",
    adminFullName: "",
    adminEmail: "",
    adminPassword: "",
  },
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setCurrentStep(state, action: PayloadAction<number>) {
      state.currentStep = action.payload;
    },

    selectPlan(state, action: PayloadAction<number>) {
      state.selectedPlanId = action.payload;
      state.selectedAddonsIds = [];
    },

    toggleAddon(state, action: PayloadAction<number>) {
      const id = action.payload;
      state.selectedAddonsIds = state.selectedAddonsIds.includes(id)
        ? state.selectedAddonsIds.filter((a) => a !== id)
        : [...state.selectedAddonsIds, id];
    },

    setClinicField(
      state,
      action: PayloadAction<{ key: keyof ClinicForm; value: string }>,
    ) {
      const { key, value } = action.payload;
      state.clinicForm[key] = value;
    },

    resetSubscription: () => initialState,
  },
});

export const {
  setCurrentStep,
  selectPlan,
  toggleAddon,
  setClinicField,
  resetSubscription,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
