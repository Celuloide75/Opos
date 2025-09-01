
import { useState } from 'react';
import { Question, Answer } from './QuizApp';

export const useQuizLogic = (questions: Question[]) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);

  const handleAnswer = (selected: 'A' | 'B' | 'C' | 'D') => {
  if (showResult) return;

  const current = questions[currentQuestionIndex];
  const isCorrect = selected === current.correcta;

  const answer: Answer = {
    questionIndex: currentQuestionIndex,
    question: current.pregunta,
    selectedAnswer: selected,
    correctAnswer: current.correcta,
    isCorrect,
  };

  setAnswers((prev) => [...prev, answer]);
  setShowResult(true);

  setTimeout(() => {
    setShowResult(false);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  }, 1000); // ⏱️ 1,5 segons de pausa
};

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => {
      console.log('➡️ Passem a la següent pregunta:', prev + 1);
      return prev + 1;
    });
    } else {
      setIsQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setShowResult(false);
    setIsQuizCompleted(false);
  };

  return {
    currentQuestionIndex,
    answers,
    showResult,
    isQuizCompleted,
    handleAnswer,
    nextQuestion,
    resetQuiz,
  };
};
