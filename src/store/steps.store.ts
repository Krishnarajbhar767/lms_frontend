import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StepsState {
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
}

export const useStepsStore = create<StepsState>()(
    devtools(
        (set) => ({
            step: 1,
            setStep: (step) => set({ step }),
            nextStep: () => set((state) => ({ step: state.step + 1 })),
            prevStep: () => set((state) => ({ step: state.step - 1 })),
        }),
        {
            name: 'Steps-Store',
            enabled: true,
        }
    )
);
