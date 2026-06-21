"use client";

import { BookOpen, Shield, Swords } from "lucide-react";
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

function LessonButton({
  lesson,
  isActive,
  onSelect,
}: {
  lesson: ChessLesson;
  isActive: boolean;
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
          <p className="text-sm font-medium">{lesson.name}</p>
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
  onSelect,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  lessons: ChessLesson[];
  activeLessonId: string | null;
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
        <ScrollArea className="h-[28rem] pr-3">
          <div className="space-y-5">
            <LessonGroup
              title="Aperturas"
              icon={Swords}
              lessons={OPENING_LESSONS}
              activeLessonId={activeLessonId}
              onSelect={startLesson}
            />
            <LessonGroup
              title="Defensas"
              icon={Shield}
              lessons={DEFENSE_LESSONS}
              activeLessonId={activeLessonId}
              onSelect={startLesson}
            />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}