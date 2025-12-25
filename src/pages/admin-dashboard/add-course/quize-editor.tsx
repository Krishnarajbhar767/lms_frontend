import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { MdAdd, MdDelete, MdChevronLeft } from 'react-icons/md';
import { upsertQuize, getQuizeBySection, deleteQuize } from "../../../service/api/course-builder.api";
import type { Question, Option } from "../../../service/api/course-builder.api";
import Button from '../../../components/core/button';
import ConfirmModal from '../../../components/core/confirm-modal';

interface QuizEditorProps {
    sectionId: number;
    sectionTitle: string;
    onBack: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ sectionId, sectionTitle, onBack }) => {
    const queryClient = useQueryClient();
    const [title, setTitle] = useState(`${sectionTitle} Quiz`);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    const { data: existingQuiz, isLoading } = useQuery({
        queryKey: ['quize', sectionId],
        queryFn: () => getQuizeBySection(sectionId),
    });

    useEffect(() => {
        if (existingQuiz && !isInitialized) {
            setTitle(existingQuiz.title);
            setQuestions(existingQuiz.questions);
            setIsInitialized(true);
        }
    }, [existingQuiz, isInitialized]);

    const mutation = useMutation({
        mutationFn: (data: { sectionId: number; title: string; questions: Question[] }) => upsertQuize(data),
        onSuccess: (res: any) => {
            toast.success(res?.message || 'Quiz saved successfully');
            queryClient.invalidateQueries({ queryKey: ['quize', sectionId] });
            onBack();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to save quiz');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (quizeId: number) => deleteQuize(quizeId),
        onSuccess: (res: any) => {
            toast.success(res?.message || 'Quiz removed successfully');
            queryClient.invalidateQueries({ queryKey: ['quize', sectionId] });
            onBack();
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to remove quiz');
        }
    });

    const removeQuiz = () => {
        setIsConfirmModalOpen(true);
    };

    const handleConfirm = () => {
        if (existingQuiz?.id) {
            deleteMutation.mutate(existingQuiz.id);
        }
        setIsConfirmModalOpen(false);
    };

    const addQuestion = () => {
        setQuestions([...questions, {
            title: '',
            options: [
                { title: '', isCorrect: true },
                { title: '', isCorrect: false }
            ]
        }]);
    };

    const updateQuestionTitle = (index: number, val: string) => {
        setQuestions(prev => prev.map((q, i) => i === index ? { ...q, title: val } : q));
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const addOption = (qIndex: number) => {
        setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: [...q.options, { title: '', isCorrect: false }] } : q));
    };

    const updateOption = (qIndex: number, oIndex: number, fields: Partial<Option>) => {
        setQuestions(prev => prev.map((q, i) => {
            if (i !== qIndex) return q;
            const newOptions = q.options.map((o, j) => {
                if (fields.isCorrect) {
                    return { ...o, isCorrect: j === oIndex };
                }
                return j === oIndex ? { ...o, ...fields } : o;
            });
            return { ...q, options: newOptions };
        }));
    };

    const removeOption = (qIndex: number, oIndex: number) => {
        const targetQuestion = questions[qIndex];
        if (targetQuestion.options.length > 2) {
            setQuestions(prev => prev.map((q, i) => i === qIndex ? { ...q, options: q.options.filter((_, j) => j !== oIndex) } : q));
        } else {
            toast.error('At least 2 options are required');
        }
    };

    const handleSave = () => {
        if (!title.trim()) return toast.error('Quiz title is required');

        // If they try to save with 0 questions
        if (questions.length === 0) {
            return toast.error('Please add at least one question or remove the quiz using the "Remove Quiz" button');
        }

        for (const q of questions) {
            if (!q.title.trim()) return toast.error('All questions must have a title');
            if (q.options.length < 2) return toast.error('Each question must have at least 2 options');
            if (!q.options.some((o: Option) => o.isCorrect)) return toast.error(`Question "${q.title}" must have a correct option`);
            if (q.options.some((o: Option) => !o.title.trim())) return toast.error('All options must have a title');
        }

        mutation.mutate({ sectionId, title, questions });
    };

    if (isLoading) return <div className="p-10 text-center text-richblack-50">Loading Quiz...</div>;

    return (
        <div className="bg-richblack-800 rounded-xl shadow-2xl border border-richblack-700 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-richblack-700 bg-richblack-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button onClick={onBack} className="p-2 hover:bg-richblack-700 rounded-full transition-all text-richblack-300 hover:text-yellow-50">
                        <MdChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold text-richblack-5">Section Quiz</h2>
                        <p className="text-sm text-richblack-300">Manage questions for {sectionTitle}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    {existingQuiz && (
                        <Button
                            onClick={removeQuiz}
                            disabled={deleteMutation.isPending || mutation.isPending}
                            variant="secondary"
                        >
                            Remove Quiz
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={mutation.isPending || deleteMutation.isPending}
                        variant="primary"
                    >
                        {mutation.isPending ? 'Saving...' : 'Save Quiz'}
                    </Button>
                </div>
            </div>

            <div className="p-4 sm:p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="space-y-2">
                    <label className="block text-sm font-semibold text-richblack-200 ml-1">Quiz Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter quiz title..."
                        className="w-full px-4 py-3 bg-richblack-700 border border-richblack-600 rounded-lg text-richblack-5 placeholder:text-richblack-400 focus:ring-2 focus:ring-yellow-50/20 focus:border-yellow-50 outline-none transition-all"
                    />
                </div>

                <div className="space-y-8">
                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="p-4 sm:p-6 border border-richblack-700 rounded-xl bg-richblack-900/50 space-y-6 relative group border-l-4 border-l-yellow-50/30">
                            <button
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 p-2 text-richblack-400 hover:text-pink-200 hover:bg-pink-900/20 rounded-lg transition-all"
                            >
                                <MdDelete size={22} />
                            </button>

                            <div className="space-y-2 pr-10">
                                <label className="block text-sm font-semibold text-richblack-300 ml-1">Question {qIndex + 1}</label>
                                <textarea
                                    rows={2}
                                    value={q.title}
                                    onChange={(e) => updateQuestionTitle(qIndex, e.target.value)}
                                    placeholder="Enter your question here..."
                                    className="w-full px-4 py-3 bg-richblack-800 border border-richblack-600 rounded-lg text-richblack-5 placeholder:text-richblack-500 focus:ring-2 focus:ring-yellow-50/20 focus:border-yellow-50 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-richblack-500 uppercase tracking-widest ml-1">Options & Answers</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((o, oIndex) => (
                                        <div key={oIndex} className="flex items-center gap-3">
                                            <div className="relative flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    checked={o.isCorrect}
                                                    onChange={() => updateOption(qIndex, oIndex, { isCorrect: true })}
                                                    className="w-6 h-6 opacity-0 absolute z-10 cursor-pointer"
                                                />
                                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${o.isCorrect ? 'border-yellow-50 bg-yellow-50' : 'border-richblack-500 bg-transparent'}`}>
                                                    {o.isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-richblack-900" />}
                                                </div>
                                            </div>

                                            <div className="flex-1 flex items-center gap-2 group/opt">
                                                <input
                                                    type="text"
                                                    value={o.title}
                                                    onChange={(e) => updateOption(qIndex, oIndex, { title: e.target.value })}
                                                    placeholder={`Option ${oIndex + 1}`}
                                                    className={`w-full px-4 py-2 border rounded-lg outline-none transition-all ${o.isCorrect ? 'border-yellow-50 bg-yellow-50/5 text-richblack-5' : 'border-richblack-600 bg-richblack-800 text-richblack-200 hover:border-richblack-500 focus:border-richblack-400'}`}
                                                />
                                                <button
                                                    onClick={() => removeOption(qIndex, oIndex)}
                                                    className="p-1.5 text-richblack-500 hover:text-pink-200 transition-all"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => addOption(qIndex)}
                                    className="text-yellow-50 text-sm font-bold hover:text-yellow-100 flex items-center gap-1.5 px-4 py-2 rounded-lg bg-yellow-50/5 hover:bg-yellow-50/10 transition-all w-fit mt-2 ml-1"
                                >
                                    <MdAdd size={20} /> Add Option
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addQuestion}
                    className="w-full py-6 border-2 border-dashed border-richblack-600 rounded-xl text-richblack-400 hover:text-yellow-50 hover:border-yellow-50 hover:bg-yellow-50/5 transition-all font-bold flex flex-col items-center justify-center gap-2 group"
                >
                    <div className="p-2 rounded-full bg-richblack-700 group-hover:bg-yellow-50/20 transition-all">
                        <MdAdd size={28} />
                    </div>
                    <span>Add New Question</span>
                </button>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onCancel={() => setIsConfirmModalOpen(false)}
                onConfirm={handleConfirm}
                title="Remove Quiz"
                description="Are you sure you want to remove this quiz? This action cannot be undone."
                confirmText="Remove"
                cancelText="Cancel"
                variant="danger"
                loading={deleteMutation.isPending}
            />
        </div>
    );
};

export default QuizEditor;
