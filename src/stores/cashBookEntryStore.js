import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCashBookEntryStore = create(
    persist(
        (set) => ({
            entryData: {},
            setEntryData: (value) => {
                set({
                    entryData: value,
                });
            },
            resetEntryData: () => {
                set({
                    entryData: {},
                });
            },
        }),
        {
            name: "cashBook-entry-store", // Name of the key in localStorage
        }
    )
);

export default useCashBookEntryStore;
