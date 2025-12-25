import React, { useState } from 'react';
import { MdCheckCircle, MdCancel, MdChevronRight, MdRefresh } from 'react-icons/md';
import type { Question, Quize } from '../../../service/api/course-builder.api';

interface QuizViewProps {
    quiz: Quize;
    onClose?: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ quiz, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOptions, setSelectedOptions] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);

    const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
        if (showResults) return;
        setSelectedOptions({
            ...selectedOptions,
            [questionIndex]: optionIndex
        });
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOptions({});
        setShowResults(false);
    };

    const calculateScore = () => {
        let score = 0;
        quiz.questions.forEach((q, qIdx) => {
            const selectedOptIdx = selectedOptions[qIdx];
            if (selectedOptIdx !== undefined && q.options[selectedOptIdx].isCorrect) {
                score++;
            }
        });
        return score;
    };

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

    if (showResults) {
        const score = calculateScore();
        const percentage = Math.round((score / quiz.questions.length) * 100);

        return (
            <div className="bg-richblack-800 rounded-2xl shadow-2xl border border-richblack-700 p-6 sm:p-10 max-w-2xl mx-auto animate-in zoom-in duration-500 text-center">
                <div className="space-y-6">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-caribbeangreen-500/10 text-caribbeangreen-100 mb-2">
                        <MdCheckCircle size={56} />
                    </div>
                    <h2 className="text-3xl font-bold text-richblack-5">Quiz Completed!</h2>
                    <p className="text-richblack-200 text-lg">You scored <span className="text-yellow-50 font-bold">{score}</span> out of <span className="text-richblack-50">{quiz.questions.length}</span></p>

                    <div className="relative pt-4 pb-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-bold text-richblack-400 uppercase tracking-widest">Performance</span>
                            <span className="text-sm font-black text-yellow-50">{percentage}%</span>
                        </div>
                        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-richblack-700">
                            <div style={{ width: `${percentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-50 transition-all duration-1000"></div>
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={resetQuiz}
                            className="flex-1 py-4 bg-yellow-50 text-richblack-900 rounded-xl font-bold hover:scale-95 transition-all duration-200 flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]"
                        >
                            <MdRefresh size={22} /> Retake Quiz
                        </button>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 bg-richblack-700 text-richblack-5 rounded-xl font-bold hover:bg-richblack-600 transition-all"
                            >
                                Back to Course
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-richblack-800 rounded-2xl shadow-2xl border border-richblack-700 overflow-hidden max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="bg-richblack-900 px-6 sm:px-10 py-5 border-b border-richblack-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-richblack-400 uppercase tracking-[0.2em]">Question {currentQuestionIndex + 1} / {quiz.questions.length}</span>
                <div className="h-2 w-full sm:w-40 bg-richblack-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-yellow-50 transition-all duration-500 shadow-[0_0_10px_rgba(255,214,10,0.5)]"
                        style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="p-6 sm:p-10 space-y-8">
                <h3 className="text-xl sm:text-2xl font-bold text-richblack-5 leading-snug">{currentQuestion.title}</h3>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionSelect(currentQuestionIndex, idx)}
                            className={`w-full p-5 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${selectedOptions[currentQuestionIndex] === idx
                                    ? 'border-yellow-50 bg-yellow-50/5 shadow-[0_0_20px_rgba(255,214,10,0.1)]'
                                    : 'border-richblack-700 bg-richblack-900/50 hover:border-richblack-600 hover:bg-richblack-700/50'
                                }`}
                        >
                            <span className={`font-semibold sm:text-lg ${selectedOptions[currentQuestionIndex] === idx ? 'text-yellow-50' : 'text-richblack-200'
                                }`}>{option.title}</span>

                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${selectedOptions[currentQuestionIndex] === idx
                                    ? 'border-yellow-50 bg-yellow-50'
                                    : 'border-richblack-500 group-hover:border-richblack-400'
                                }`}>
                                {selectedOptions[currentQuestionIndex] === idx && <div className="w-2.5 h-2.5 rounded-full bg-richblack-900"></div>}
                            </div>
                        </button>
                    ))}
                </div>

                <div className="pt-6">
                    <button
                        onClick={nextQuestion}
                        disabled={selectedOptions[currentQuestionIndex] === undefined}
                        className="w-full py-5 bg-yellow-50 text-richblack-900 rounded-xl font-black text-lg hover:scale-[0.98] disabled:opacity-30 disabled:grayscale disabled:scale-100 transition-all flex items-center justify-center gap-3 group shadow-[0_4px_0_0_rgba(255,255,255,0.2)] active:shadow-none active:translate-y-[2px]"
                    >
                        {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                        <MdChevronRight size={26} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizView;
