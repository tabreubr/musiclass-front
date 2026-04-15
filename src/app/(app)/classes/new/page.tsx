"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { classesService } from "@/services/classesService";
import { studentsService } from "@/services/studentsService";
import { instructorsService } from "@/services/instructorsService";
import { useFetch } from "@/hooks/useFetch";

export default function NewClassPage() {
  const router = useRouter();

  const { data: students } = useFetch(() => studentsService.findAll());
  const { data: instructors } = useFetch(() => instructorsService.findAll());

  const [studentId, setStudentId] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [date, setDate] = useState("");
  const [observations, setObservations] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!studentId) newErrors.student = "Select a student";
    if (!instructorId) newErrors.instructor = "Select an instructor";
    if (!date) newErrors.date = "Select a date and time";
    else if (new Date(date) <= new Date()) newErrors.date = "Date must be in the future";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      const created = await classesService.save({
        date,
        observations,
        student: { id: Number(studentId) },
        instructor: { id: Number(instructorId) },
      });
      router.push(`/classes/${created.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error creating class");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark px-5 pt-12 pb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-white/80 text-sm mb-5 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Classes
        </button>
        <h1 className="text-white font-bold text-2xl">New Class</h1>
        <p className="text-white/70 text-sm mt-1">Schedule a new lesson</p>
      </div>

      {/* Formulário */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">

        {/* Aluno */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            Student
          </label>
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">Select a student...</option>
            {(students ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.instrument?.name ?? ""}
              </option>
            ))}
          </select>
          {errors.student && <p className="text-status-failed text-xs mt-2">{errors.student}</p>}
        </div>

        {/* Instrutor */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            Instructor
          </label>
          <select
            value={instructorId}
            onChange={(e) => setInstructorId(e.target.value)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          >
            <option value="">Select an instructor...</option>
            {(instructors ?? []).map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          {errors.instructor && <p className="text-status-failed text-xs mt-2">{errors.instructor}</p>}
        </div>

        {/* Data e hora */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            Date & Time
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full text-sm text-text-primary outline-none bg-transparent"
          />
          {errors.date && <p className="text-status-failed text-xs mt-2">{errors.date}</p>}
        </div>

        {/* Observações */}
        <div className="bg-white rounded-2xl p-4 shadow-card">
          <label className="text-text-secondary text-xs font-semibold uppercase tracking-wide block mb-3">
            Observations <span className="normal-case font-normal">(optional)</span>
          </label>
          <textarea
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            placeholder="Any notes before the class..."
            rows={3}
            className="w-full text-sm text-text-primary placeholder-text-secondary resize-none outline-none"
          />
        </div>

        {/* Aviso sobre passed */}
        <div className="bg-amber-50 rounded-2xl px-4 py-3 flex items-start gap-3">
          <span className="text-lg">💡</span>
          <p className="text-amber-700 text-xs leading-relaxed">
            The class result (Passed / Failed) can be registered after the lesson in the class detail screen.
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full py-4 bg-primary text-white font-semibold rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
        >
          {saving ? "Creating..." : "Create Class"}
        </button>
      </div>
    </div>
  );
}
