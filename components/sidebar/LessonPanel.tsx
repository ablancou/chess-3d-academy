"use client";

import { CheckCircle2, GraduationCap, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLessonById } from "@/lib/chess/lessons";
import { isStudentTurn } from "@/lib/chess/lessons/engine";
import { useGameStore } from "@/stores/game-store";

export function LessonPanel() {
  const mode = useGameStore((s) => s.mode);
  const activeLessonId = useGameStore((s) => s.activeLessonId);
  const lessonStepIndex = useGameStore((s) => s.lessonStepIndex);
  const lessonFeedback = useGameStore((s) => s.lessonFeedback);
  const lessonComplete = useGameStore((s) => s.lessonComplete);
  const turn = useGameStore((s) => s.turn);
  const exitLesson = useGameStore((s) => s.exitLesson);

  if (mode !== "lesson" || !activeLessonId) return null;

  const lesson = getLessonById(activeLessonId);
  if (!lesson) return null;

  const totalSteps = lesson.steps.length;
  const progress = Math.round((lessonStepIndex / totalSteps) * 100);
  const studentTurn = isStudentTurn(lesson, lessonStepIndex);
  const nextStep = lesson.steps[lessonStepIndex];

  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="size-4 text-emerald-400" />
              {lesson.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {lesson.category === "opening" ? "Apertura" : "Defensa"} ·{" "}
              {lesson.eco}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={exitLesson}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Progreso: {lessonStepIndex}/{totalSteps}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        {lessonComplete ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
            <p className="text-sm">{lessonFeedback}</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Juegas {lesson.studentColor === "w" ? "blancas" : "negras"}
              </Badge>
              {studentTurn ? (
                <Badge className="bg-emerald-600">Tu turno</Badge>
              ) : (
                <Badge variant="secondary">Turno del rival</Badge>
              )}
            </div>

            {studentTurn && nextStep && (
              <p className="text-xs text-muted-foreground">
                Objetivo: juega <strong>{nextStep.move}</strong>
              </p>
            )}

            {lessonFeedback && (
              <p className="rounded-lg border border-border bg-background/60 p-3 text-sm leading-relaxed">
                {lessonFeedback}
              </p>
            )}

            {!studentTurn && turn !== lesson.studentColor && (
              <p className="text-xs text-muted-foreground italic">
                El rival está jugando automáticamente…
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}