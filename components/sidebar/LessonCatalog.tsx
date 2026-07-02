"use client";

import { BookOpen, CheckCircle2, Heart, Shield, Swords } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DEFENSE_LESSONS,
  OPENING_LESSONS,
  type ChessLesson,
} from "@/lib/chess/lessons";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/stores/game-store";
import { useProgressStore } from "@/stores/progress-store";

function LessonButton({
  lesson,
  isActive,
  isCompleted,
  onSelect,
}: {
  lesson: ChessLesson;
  isActive: boolean;
  isCompleted: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all",
        isActive
          ? "border-sky-400/50 bg-sky-500/10 ring-1 ring-sky-400/20"
          : "border-border hover:border-sky-400/30 hover:bg-accent/40",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium">
            {isCompleted && (
              <CheckCircle2 className="size-3.5 shrink-0 text-emerald-400" />
            )}
            {lesson.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {lesson.description}
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {lesson.eco}
        </Badge>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {lesson.keyIdeas.slice(0, 2).map((idea) => (
          <span
            key={idea}
            className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
          >
            {idea}
          </span>
        ))}
      </div>
    </button>
  );
}

function LessonGroup({
  title,
  icon: Icon,
  lessons,
  activeLessonId,
  completedLessons,
  onSelect,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  lessons: ChessLesson[];
  activeLessonId: string | null;
  completedLessons: string[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Icon className="size-3.5 text-sky-400" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title} ({lessons.length})
        </h3>
      </div>
      <div className="space-y-2">
        {lessons.map((lesson) => (
          <LessonButton
            key={lesson.id}
            lesson={lesson}
            isActive={activeLessonId === lesson.id}
            isCompleted={completedLessons.includes(lesson.id)}
            onSelect={() => onSelect(lesson.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function LessonCatalog() {
  const activeLessonId = useGameStore((s) => s.activeLessonId);
  const startLesson = useGameStore((s) => s.startLesson);
  const completedLessons = useProgressStore((s) => s.completedLessons);
  const hearts = useProgressStore((s) => s.hearts);

  const outOfHearts = hearts === 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BookOpen className="size-4 text-sky-400" />
          Lecciones
        </CardTitle>
        <CardDescription>
          {OPENING_LESSONS.length} aperturas y {DEFENSE_LESSONS.length} defensas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {outOfHearts && (
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-300">
            <Heart className="size-4 shrink-0" />
            Sin vidas: se regeneran con el tiempo (1 cada 30 min).
          </div>
        )}
        <ScrollArea className="h-[28rem] pr-3">
          <div
            className={cn("space-y-5", outOfHearts && "pointer-events-none opacity-50")}
          >
            <LessonGroup
              title="Aperturas"
              icon={Swords}
              lessons={OPENING_LESSONS}
              activeLessonId={activeLessonId}
              completedLessons={completedLessons}
              onSelect={startLesson}
            />
            <LessonGroup
              title="Defensas"
              icon={Shield}
              lessons={DEFENSE_LESSONS}
              activeLessonId={activeLessonId}
              completedLessons={completedLessons}
              onSelect={startLesson}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}