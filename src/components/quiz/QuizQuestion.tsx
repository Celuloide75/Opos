import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Question } from './QuizApp';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  showResult: boolean;
  onAnswer: (selected: 'A' | 'B' | 'C' | 'D') => void;
  onNext: () => void;
}

export const QuizQuestion = ({
  question,
  questionNumber,
  totalQuestions,
  showResult,
  onAnswer,
}: QuizQuestionProps) => {
  const [selected, setSelected] = useState<'A' | 'B' | 'C' | 'D' | null>(null);

  useEffect(() => {
    setSelected(null);
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 100);
  }, [question]);

  const handleClick = (option: 'A' | 'B' | 'C' | 'D') => {
    if (selected !== null) return;
    setSelected(option);
    onAnswer(option);
  };

  const isCorrect = selected && selected === question.correcta;

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl min-h-[400px] h-auto p-8 shadow-[var(--shadow-quiz)] text-left space-y-6">
        <div className="text-sm text-muted-foreground">
          Pregunta {questionNumber} de {totalQuestions}
        </div>
        <h2 className="text-xl font-semibold">{question.pregunta}</h2>
        <div className="flex flex-col gap-4 mt-4">
          {(['A', 'B', 'C', 'D'] as const).map((option) => (
            <Button
              key={option}
              onClick={() => handleClick(option)}
              variant="outline"
              className={`flex flex-row items-center justify-start text-left py-2 px-3 whitespace-normal break-words rounded-lg w-full min-h-[120px] max-h-[140px] overflow-y-auto ${
                selected
                  ? option === question.correcta
                    ? 'border-green-500 text-green-600'
                    : option === selected
                    ? 'border-red-500 text-red-600'
                    : 'opacity-50'
                  : ''
              }`}
              disabled={selected !== null}
            >
              <span className="font-bold mr-2">{option}.</span>
              <span className="break-words text-left w-full">{question[option]}</span>
            </Button>
          ))}
        </div>

        {showResult && selected && (
          <div
            className={`mt-4 text-center font-semibold ${
              isCorrect ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isCorrect ? '✅ Resposta correcta!' : '❌ Resposta incorrecta'}
          </div>
        )}
      </Card>
    </div>
  );
};