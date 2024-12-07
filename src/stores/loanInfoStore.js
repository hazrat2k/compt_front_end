import { create } from "zustand";
import { persist } from "zustand/middleware";

const loanInfoStore = (set) => ({
    info: {},
    addField: (key, value) => {
        set((state) => ({
            info: { ...state.info, [key]: value },
        }));
    },
    reset: () => {
        set({
            info: {},
        });
    },
});

const useLoanInfoStore = create(persist(loanInfoStore));

export default useLoanInfoStore;
