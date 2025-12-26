import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { GrAddCircle } from "react-icons/gr";
import { MdDelete, MdEdit, MdDragIndicator } from "react-icons/md";
import { IoIosArrowDown, IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import { BiSolidRightArrow } from "react-icons/bi";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { useCourseStore } from "../../../store/course.store";
import { createSection, deleteSection, updateSection, reorderSections, reorderLessonsApi, deleteLesson } from "../../../service/api/course-builder.api";
import type { Section, Lesson } from "../../../service/api/course-builder.api";
import type { Course } from "../../../service/api/course.api";
import Input from "../../../components/core/input";
import Button from "../../../components/core/button";
import { useStepsStore } from "../../../store/steps.store";

import { AddLessonForm } from "./add-lesson-form";
import { EditLessonForm } from "./edit-lesson-form";
import QuizEditor from "./quize-editor";
import { queryClient } from "../../../main";
import ConfirmModal from "../../../components/core/confirm-modal";
import BunnyPlayer from "../../../components/core/bunny-player";
import { useMutation } from "@tanstack/react-query";



export const CourseBuilderForm = () => {
    const { course, updateCourse } = useCourseStore();
    const { nextStep, prevStep } = useStepsStore();
    const [activeQuizSection, setActiveQuizSection] = useState<{ id: number, title: string } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, submitCount },
    } = useForm({
        defaultValues: {
            sectionName: "",
        },
    });

    const { mutateAsync: createSectionMutation, isPending: isCreatingSection } = useMutation({
        mutationFn: async (sectionName: string) => {
            return await createSection(sectionName, course.id!);
        },
        onSuccess: (result) => {
            if (result) {
                const newSection = { ...result, lessons: [] };
                let updatedSections = [...(course.sections || []), newSection];
                updateCourse({ sections: updatedSections });
                setValue("sectionName", "");
                toast.success("Section created successfully");
            }
        },
        onError: () => {
            toast.error("Failed to create section");
        }
    });

    const onCreateSection = async (data: { sectionName: string }) => {
        await createSectionMutation(data.sectionName);
    };

    const { mutateAsync: reorderSectionsMutation } = useMutation({
        mutationFn: async (newSections: Section[]) => {
            const sectionOrder = newSections.map((s, index) => ({ id: s.id, order: index + 1 }));
            return await reorderSections(course.id!, sectionOrder);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            console.error("Reorder failed", error);
            const msg = error?.response?.data?.message || error.message || "Unknown error";
            toast.error("Failed to save section order: " + msg);
        }
    });

    const handleReorderSections = async (newSections: Section[]) => {
        if (!course.id) {
            toast.error("Course ID is missing. Please save course first.");
            return;
        }
        updateCourse({ sections: newSections });
        await reorderSectionsMutation(newSections);
    };

    const { mutateAsync: reorderLessonsMutation } = useMutation({
        mutationFn: async ({ sectionId, newLessons }: { sectionId: number, newLessons: Lesson[] }) => {
            const lessonOrder = newLessons.map((l, index) => ({ id: l.id, order: index + 1 }));
            return await reorderLessonsApi(sectionId, lessonOrder);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
        onError: (error: any) => {
            console.error("Lesson reorder failed", error);
            toast.error("Failed to save lesson order");
        }
    });

    const handleReorderLessons = async (sectionId: number, newLessons: Lesson[]) => {
        if (!course.sections) return;
        const updatedSections = course.sections.map(s =>
            s.id === sectionId ? { ...s, lessons: newLessons } : s
        );
        updateCourse({ sections: updatedSections });
        await reorderLessonsMutation({ sectionId, newLessons });
    }


    const sensors = useSensors(
        useSensor(PointerSensor, {
            // prevent drag triggering on buttons inside
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!active || !over) return;

        const activeIdStr = String(active.id);
        const overIdStr = String(over.id);

        // Case 1: Reordering Sections
        if (activeIdStr.startsWith("section-") && overIdStr.startsWith("section-")) {
            if (active.id !== over.id && course.sections) {
                const oldIndex = course.sections.findIndex((s) => `section-${s.id}` === active.id);
                const newIndex = course.sections.findIndex((s) => `section-${s.id}` === over.id);

                if (oldIndex === -1 || newIndex === -1) return;

                const newSections = arrayMove(course.sections, oldIndex, newIndex);
                handleReorderSections(newSections);
            }
        }
        // Case 2: Reordering Lessons
        else if (activeIdStr.startsWith("lesson-") && overIdStr.startsWith("lesson-")) {
            // Find the section this lesson belongs to
            // We can infer it from the lesson data usually, or find it in the course tree
            const activeLessonId = Number(activeIdStr.split("-")[1]);
            const overLessonId = Number(overIdStr.split("-")[1]);

            if (activeLessonId === overLessonId) return;

            // Find section containing these lessons
            const section = course.sections?.find(s => s.lessons.some(l => l.id === activeLessonId));

            if (!section) return;

            // Ensure we are dropping within the same section (for now 1D list per section)
            const isOverInSameSection = section.lessons.some(l => l.id === overLessonId);
            if (!isOverInSameSection) return;

            const oldIndex = section.lessons.findIndex(l => l.id === activeLessonId);
            const newIndex = section.lessons.findIndex(l => l.id === overLessonId);

            const newLessons = arrayMove(section.lessons, oldIndex, newIndex);
            handleReorderLessons(section.id, newLessons);
        }
    };

    return (
        <div className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6">
            <h2 className="text-2xl font-semibold text-richblack-5">Course Builder</h2>

            <form onSubmit={handleSubmit(onCreateSection)} className="space-y-4" key={submitCount}>
                <Input
                    label="Section Name"
                    name="sectionName"
                    placeholder="Add a section to create your course"
                    register={register}
                    error={errors}
                    validation={{ required: "Section name is required" }}
                />
                <Button
                    type="submit"
                    variant="outline"
                    className="flex items-center gap-x-2 border-yellow-50 text-yellow-50"
                    disabled={isCreatingSection}
                >
                    <GrAddCircle className="text-yellow-50" />
                    {isCreatingSection ? "Creating..." : "Create Section"}
                </Button>
            </form>

            <div className="mt-10">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={course.sections?.map(s => `section-${s.id}`) || []}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="flex flex-col gap-y-4">
                            {course.sections?.map((section) => (
                                <NestedSection
                                    key={section.id}
                                    section={section}
                                    courseId={course.id!}
                                    setActiveQuiz={setActiveQuizSection}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            <div className="flex justify-end gap-x-3">
                <Button onClick={prevStep} variant="secondary" className="flex items-center justify-center gap-x-2">
                    <IoMdArrowRoundBack /> Back
                </Button>
                <Button onClick={nextStep} className="flex items-center justify-center gap-x-2">
                    Next <IoMdArrowRoundForward />
                </Button>
            </div>

            {activeQuizSection && (
                <div
                    onClick={() => setActiveQuizSection(null)}
                    className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto cursor-pointer"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl max-h-[90vh] cursor-default"
                    >
                        <QuizEditor
                            sectionId={activeQuizSection.id}
                            sectionTitle={activeQuizSection.title}
                            onBack={() => setActiveQuizSection(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

const NestedSection = ({ section, setActiveQuiz }: { section: Section, courseId: number, setActiveQuiz: (s: { id: number, title: string }) => void }) => {
    const { updateCourse, course } = useCourseStore();
    const [isExpanded, setIsExpanded] = useState(true);
    const [addSubSection, setAddSubSection] = useState(false);
    const [isEditingSection, setIsEditingSection] = useState(false);
    const [sectionName, setSectionName] = useState(section.title);

    // Deletion
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { mutateAsync: deleteSectionMutation, isPending: isDeletingSection } = useMutation({
        mutationFn: async (id: number) => {
            return await deleteSection(id);
        },
        onSuccess: () => {
            const updatedSections = course.sections?.filter(s => s.id !== section.id);
            updateCourse({ sections: updatedSections });
            toast.success("Section deleted");
            setShowDeleteConfirm(false);
        },
        onError: () => {
            toast.error("Failed to delete section");
        }
    });

    const handleDeleteSection = async () => {
        await deleteSectionMutation(section.id);
    }

    const { mutateAsync: updateSectionMutation } = useMutation({
        mutationFn: async (newName: string) => {
            return await updateSection(section.id, newName);
        },
        onSuccess: (updated) => {
            if (updated) {
                const updatedSections = course.sections?.map(s => s.id === section.id ? { ...s, title: sectionName } : s);
                updateCourse({ sections: updatedSections });
                setIsEditingSection(false);
                toast.success("Section updated");
            }
        },
        onError: () => {
            toast.error("Failed to update section");
        }
    });

    // Edit Section Name
    const handleEditSection = async () => {
        if (!sectionName.trim()) {
            toast.error("Section name cannot be empty");
            return;
        }
        await updateSectionMutation(sectionName);
    }

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: `section-${section.id}` }); // ID Prefix

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <React.Fragment>
            <div ref={setNodeRef} style={style} className="rounded-lg border border-richblack-600 bg-richblack-700 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-3 w-full">
                        {/* Only drag handle triggers drag */}
                        <div {...attributes} {...listeners} className="cursor-grab">
                            <MdDragIndicator className="text-2xl text-richblack-300" />
                        </div>

                        <button onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? <IoIosArrowDown className="text-xl text-richblack-300" /> : <BiSolidRightArrow className="text-xl text-richblack-300" />}
                        </button>

                        {isEditingSection ? (
                            <div className="flex items-center gap-x-2">
                                <input
                                    value={sectionName}
                                    onChange={(e) => setSectionName(e.target.value)}
                                    className="w-full rounded-md bg-richblack-600 p-2 text-richblack-5 focus:outline-none focus:ring-1 focus:ring-yellow-50"
                                />
                                <Button onClick={handleEditSection}>Save</Button>
                                <Button variant='secondary' onClick={() => setIsEditingSection(false)}>Cancel</Button>
                            </div>
                        ) : (
                            <span className="font-semibold text-richblack-5">{section.title}</span>
                        )}

                    </div>
                    <div className="flex items-center gap-x-3 ml-2">
                        {
                            !isEditingSection && (
                                <button onClick={() => setIsEditingSection(prev => !prev)} className="text-richblack-300 hover:text-yellow-50">
                                    <MdEdit size={20} />
                                </button>
                            )
                        }
                        <button
                            onClick={() => setActiveQuiz({ id: section.id, title: section.title })}
                            className="bg-yellow-50/10 text-yellow-50 px-3 py-1 rounded-md text-sm font-bold hover:bg-yellow-50 hover:text-richblack-900 transition-all border border-yellow-50/20"
                        >
                            Quiz
                        </button>
                        <button onClick={() => setShowDeleteConfirm(true)} className="text-richblack-300 hover:text-pink-200">
                            <MdDelete size={20} />
                        </button>
                    </div>
                </div>

                {isExpanded && (
                    <div className="pl-8 pt-4 space-y-3">
                        {/* Lessons List - Sortable Context */}
                        <SortableContext
                            items={section.lessons?.map(l => `lesson-${l.id}`) || []}
                            strategy={verticalListSortingStrategy}
                        >
                            {section.lessons?.map((lesson) => (
                                <NestedLesson
                                    key={lesson.id}
                                    lesson={lesson}
                                    course={course as Course}
                                    updateCourse={updateCourse}
                                />
                            ))}
                        </SortableContext>

                        {!addSubSection ? (
                            <button onClick={() => setAddSubSection(true)} className="flex items-center gap-x-2 text-yellow-50 font-semibold py-2">
                                <GrAddCircle />
                                <span>Add Lesson</span>
                            </button>
                        ) : (
                            <AddLessonForm
                                sectionId={section.id}
                                onCancel={() => setAddSubSection(false)}
                                onSuccess={() => setAddSubSection(false)}
                            />
                        )}
                    </div>
                )}
            </div>
            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Section?"
                description="This will permanently delete the section and all its contents including videos and resources."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={isDeletingSection}
                onConfirm={handleDeleteSection}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </React.Fragment>
    );
};

const NestedLesson: React.FC<{
    lesson: Lesson;
    course: Course;
    updateCourse: (updates: Partial<Course>) => void;
}> = ({ lesson, course, updateCourse }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isEditingLesson, setIsEditingLesson] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const { mutateAsync: deleteLessonMutation, isPending: isDeletingLesson } = useMutation({
        mutationFn: async (id: number) => {
            return await deleteLesson(id);
        },
        onSuccess: () => {
            const newSections = course.sections?.map(section => {
                if (section.id === lesson.sectionId) {
                    return {
                        ...section,
                        lessons: section.lessons.filter(l => l.id !== lesson.id)
                    };
                }
                return section;
            });

            updateCourse({ sections: newSections });
            queryClient.invalidateQueries({ queryKey: ["course"] });
            toast.success("Lesson deleted successfully");
            setShowDeleteConfirm(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to delete lesson");
        }
    });

    const handleDeleteLesson = async () => {
        await deleteLessonMutation(lesson.id);
    };

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: `lesson-${lesson.id}` }); // ID Prefix

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="flex flex-col border-b border-richblack-600 py-2 last:border-none bg-richblack-700">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-3 w-full">
                    <div {...attributes} {...listeners} className="cursor-grab">
                        <MdDragIndicator className="text-lg text-richblack-300" />
                    </div>

                    <div className="flex items-center gap-x-3 cursor-pointer w-full" onClick={() => setIsExpanded(!isExpanded)}>
                        <span className="text-richblack-50">{lesson.title}</span>
                        <div className="ml-auto flex items-center gap-x-3">
                            <button onClick={(e) => { e.stopPropagation(); setIsEditingLesson(true); }} className="text-richblack-300 hover:text-yellow-50">
                                <MdEdit size={20} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} className="text-richblack-300 hover:text-pink-200">
                                <MdDelete size={20} />
                            </button>
                            <IoIosArrowDown className={`text-sm text-richblack-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                        </div>
                    </div>
                </div>
            </div>

            {isEditingLesson ? (
                <div className="mt-4">
                    <EditLessonForm
                        lesson={lesson}
                        onCancel={() => setIsEditingLesson(false)}
                        onSuccess={() => setIsEditingLesson(false)}
                    />
                </div>
            ) : (
                isExpanded && (
                    <div className="mt-2 pl-8 animate-in fade-in slide-in-from-top-1 duration-200">
                        {lesson.bunnyVideoId && (
                            <div className="mb-2">
                                <BunnyPlayer videoId={lesson.bunnyVideoId} />
                            </div>
                        )}
                        {lesson.resource && lesson.resource.length > 0 && (
                            <a href={lesson.resource[0].url} target="_blank" rel="noopener noreferrer" className="text-yellow-50 underline text-sm hover:text-yellow-100 transition-colors">
                                View Resource
                            </a>
                        )}
                    </div>
                )
            )}

            <ConfirmModal
                isOpen={showDeleteConfirm}
                title="Delete Lesson?"
                description="Are you sure you want to delete this lesson? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                loading={isDeletingLesson}
                onConfirm={handleDeleteLesson}
                onCancel={() => setShowDeleteConfirm(false)}
            />
        </div>
    )
}
