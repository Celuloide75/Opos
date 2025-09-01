import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';
import { useQuizLogic } from './useQuizLogic';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Papa from 'papaparse';
import { Question } from './types'; // ✅ Si tens el tipus definit externament

const GOOGLE_SHEETS_URL =
  'https://docs.google.com/spreadsheets/d/1f2CO2iYCD6g3Uhte6MvhkJCBv7n_rrBuE1iotB_jX9U/export?format=csv';

export const QuizApp = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    currentQuestionIndex,
    answers,
    showResult,
    isQuizCompleted,
    handleAnswer,
    nextQuestion,
    resetQuiz,
    startNewQuiz,
    questions,
  } = useQuizLogic([]);

  const parseCSV = (csvText: string): Question[] => {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return result.data
      .map((row: any) => ({
        pregunta: row.pregunta || '',
        A: row.A || '',
        B: row.B || '',
        C: row.C || '',
        D: row.D || '',
        correcta: (row.correcta || 'A') as 'A' | 'B' | 'C' | 'D',
      }))
      .filter((q) => q.pregunta && q.A && q.B && q.C && q.D);
  };

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(GOOGLE_SHEETS_URL);
      if (!response.ok) {
        throw new Error("No s'ha pogut carregar el fitxer de preguntes.");
      }

      const csvText = await response.text();
      const allQuestions = parseCSV(csvText);

      if (allQuestions.length === 0) {
        throw new Error("No s'han trobat preguntes vàlides al fitxer.");
      }

      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10); // ✅ Només 10 preguntes

      startNewQuiz(selected); // 👈 S’envien al hook
      setIsQuizStarted(false); // Esperem que l’usuari faci clic per començar

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const startQuiz = () => {
    resetQuiz();
    setIsQuizStarted(true);
  };

  const restartApp = () => {
    setIsQuizStarted(false);
    loadQuestions();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Card className="w-full max-w-md p-8 text-center shadow-[var(--shadow-quiz)]">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold mb-2">Carregant preguntes...</h2>
          <p className="text-muted-foreground">Un moment, estem preparant el quiz</p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Card className="w-full max-w-md p-8 shadow-[var(--shadow-quiz)]">
          <div className="text-center mb-6">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Error al carregar</h2>
          </div>
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center">
            <Button onClick={loadQuestions}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Tornar a intentar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (isQuizCompleted) {
    return (
      <QuizResults
        answers={answers}
        questions={questions}
        onRestart={startQuiz}
        onBackToUpload={restartApp}
      />
    );
  }

  if (!isQuizStarted || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/30">
        <Card className="w-full max-w-2xl p-8 shadow-[var(--shadow-quiz)]">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-[var(--gradient-primary)] bg-clip-text text-transparent mb-4">
              Quiz Interactiu
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Test amb preguntes carregades automàticament
            </p>
            <div className="text-sm text-muted-foreground mb-8">
              ✅ {questions.length} preguntes seleccionades
            </div>
            <Button
              onClick={startQuiz}
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-4 text-lg"
            >
              Començar Quiz
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-background to-secondary/30">
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        showResult={showResult}
        onAnswer={handleAnswer}
        onNext={nextQuestion}
      />
    </div>
  );
};
