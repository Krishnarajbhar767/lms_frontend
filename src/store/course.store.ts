import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Course } from "../service/api/course.api";

interface CourseStore {
    course: Partial<Course>;
    setCourse: (course: Partial<Course>) => void;
    updateCourse: (updates: Partial<Course>) => void;
    resetCourse: () => void;
}

export const useCourseStore = create<CourseStore>()(
    devtools(
        (set) => ({
            course: {},
            setCourse: (course) => set({ course }),
            updateCourse: (updates) => set((state) => ({ course: { ...state.course, ...updates } })),
            resetCourse: () => set({ course: {} }),
        }),
        { name: "CourseStore", enabled: true }
    )
);
