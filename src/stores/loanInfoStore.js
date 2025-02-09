import { create } from "zustand";
import { persist } from "zustand/middleware";

const useLoanInfoStore = create(
    persist(
        (set) => ({
            loanInfo: {},
            addLoanField: (key, value) => {
                set((state) => ({
                    loanInfo: { ...state.loanInfo, [key]: value }, // Fixed state key
                }));
            },
            resetLoanInfo: () => {
                set({
                    loanInfo: {}, // Fixed state key
                });
            },
        }),
        {
            name: "loan-info-store", // Name of the key in localStorage
        }
    )
);

export default useLoanInfoStore;
