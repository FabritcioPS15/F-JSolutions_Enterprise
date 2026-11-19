'use client'

import { useState } from 'react'
import { AcademyHeader } from '@/components/academy/header'
import { AcademyHero } from '@/components/academy/hero'
import { ProgramsGrid } from '@/components/academy/programs-grid'
import { AcademyMethodology } from '@/components/academy/methodology'
import { TestimonialsAndInstructors } from '@/components/academy/testimonials-instructors'
import { EnrollmentModal } from '@/components/academy/enrollment-modal'
import { AcademyFooter } from '@/components/academy/footer'
import type { Course } from '@/lib/academy-data'

export default function AcademyPage() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  function handleOpenCourse(course: Course) {
    setSelectedCourse(course)
    setModalOpen(true)
  }

  function handleOpenGeneral() {
    setSelectedCourse(null)
    setModalOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink-900">
      <AcademyHeader onOpenEnroll={handleOpenGeneral} />

      <main className="flex-1">
        <AcademyHero onOpenEnroll={handleOpenGeneral} />
        <ProgramsGrid onSelectCourse={handleOpenCourse} />
        <AcademyMethodology />
        <TestimonialsAndInstructors />
      </main>

      <AcademyFooter />

      {modalOpen && (
        <EnrollmentModal
          course={selectedCourse}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
