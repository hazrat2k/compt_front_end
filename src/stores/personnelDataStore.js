import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePersonnelDataStore = create(
    persist(
        (set) => ({
            personnelData: {},
            setPersonnelData: (value) => {
                set({
                    personnelData: value,
                });
            },
            resetPersonnelData: () => {
                set({
                    personnelData: {},
                });
            },
        }),
        {
            name: "personnel-data-store", // Name of the key in localStorage
        }
    )
);

export default usePersonnelDataStore;
