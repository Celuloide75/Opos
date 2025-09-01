
import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Answer, Question } from './QuizApp';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

interface QuizResultsProps {
  answers: Answer[];
  questions: Question[];
  onRestart: () => void;
  onBackToUpload: () => void;
}

export const QuizResults = ({ answers, questions, onRestart, onBackToUpload }: QuizResultsProps) => {
  const correctCount = answers.filter((a) => a.isCorrect).length;

  const downloadErrorsAsPdf = () => {
    const incorrect = answers.filter(a => !a.isCorrect);
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(12);
    let y = 10;

    incorrect.forEach((a, index) => {
      const q = questions[a.questionIndex];
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.text(`${index + 1}. ${q.pregunta}`, 10, y);
      y += 7;

      const options = ['A', 'B', 'C', 'D'] as const;
      options.forEach(opt => {
        const text = `${opt}. ${q[opt]}`;
        const isCorrect = opt === a.correctAnswer;
        const isUserWrong = opt === a.selectedAnswer && opt !== a.correctAnswer;

        const color = isCorrect ? [0, 128, 0] : isUserWrong ? [200, 0, 0] : [0, 0, 0];
        const fontWeight = isCorrect || isUserWrong ? "bold" : "normal";

        doc.setTextColor(...color);
        doc.setFont("helvetica", fontWeight);
        doc.text(text, 12, y);
        y += 6;
      });

      y += 4;
      doc.setTextColor(0, 0, 0);
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    doc.save("respostes_incorrectes.pdf");
  };

  const incorrectAnswers = answers.filter(a => !a.isCorrect);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-2xl p-8 shadow-[var(--shadow-quiz)] space-y-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Resultats</h2>
        <p className="text-lg">Has encertat {correctCount} de {answers.length} preguntes.</p>

        <div className="flex flex-col gap-4 justify-center items-center mt-6">
          <Button onClick={onBackToUpload}>🔁 Tornar a carregar preguntes</Button>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <Button onClick={downloadErrorsAsPdf} variant="secondary">📄 Descarregar .pdf</Button>
          </div>
        </div>
      </Card>

      {incorrectAnswers.length > 0 && (
        <Card className="w-full max-w-2xl mt-8 p-6 shadow-[var(--shadow-quiz)] space-y-4 text-left">
          <h3 className="text-2xl font-semibold text-destructive">Respostes incorrectes</h3>
          {incorrectAnswers.map((a, index) => {
            const original = questions[a.questionIndex];
            return (
              <div key={index} className="border-b pb-4 space-y-2">
                <p className="font-semibold">{index + 1}. {original.pregunta}</p>
                {(['A', 'B', 'C', 'D'] as const).map((option) => {
                  const isUser = option === a.selectedAnswer;
                  const isCorrect = option === a.correctAnswer;
                  const classNames = [
                    'pl-2 rounded',
                    isCorrect ? 'text-green-600 font-semibold' : '',
                    isUser && !isCorrect ? 'text-red-600 font-semibold' : ''
                  ].join(' ');
                  return (
                    <p key={option} className={classNames}>
                      {option}. {original[option]}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};
