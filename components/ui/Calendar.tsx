'use client';

import React, { useState } from 'react';

interface CalendarProps {
    selectedDate?: Date;
    onDateSelect?: (date: Date) => void;
    markedDates?: Record<string, number>; // date string -> count
    minDate?: Date;
    maxDate?: Date;
}

export function Calendar({
    selectedDate,
    onDateSelect,
    markedDates = {},
    minDate,
    maxDate,
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get first day of month and total days
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Month navigation
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    // Generate calendar grid
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const isSelected = selectedDate?.toDateString() === date.toDateString();
        const isToday = new Date().toDateString() === date.toDateString();
        const count = markedDates[dateString] || 0;

        const isDisabled =
            (minDate && date < minDate) ||
            (maxDate && date > maxDate);

        days.push(
            <button
                key={day}
                onClick={() => !isDisabled && onDateSelect?.(date)}
                disabled={isDisabled}
                className={`
          aspect-square rounded-lg p-2 text-sm font-medium transition
          ${isDisabled ? 'cursor-not-allowed text-gray-600' : 'hover:bg-white/10'}
          ${isSelected ? 'bg-blue-600 text-white' : 'text-gray-300'}
          ${isToday && !isSelected ? 'ring-2 ring-blue-500' : ''}
        `}
            >
                <div className="flex h-full flex-col items-center justify-center">
                    <span>{day}</span>
                    {count > 0 && !isDisabled && (
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-400" title={`${count} citas`} />
                    )}
                </div>
            </button>
        );
    }

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="glass rounded-xl border border-white/10 p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={goToPreviousMonth}
                        className="rounded-lg bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:bg-white/10"
                    >
                        ←
                    </button>
                    <button
                        onClick={goToToday}
                        className="rounded-lg bg-white/5 px-3 py-1 text-sm text-gray-300 transition hover:bg-white/10"
                    >
                        Hoy
                    </button>
                    <button
                        onClick={goToNextMonth}
                        className="rounded-lg bg-white/5 px-3 py-1 text-gray-300 transition hover:bg-white/10"
                    >
                        →
                    </button>
                </div>
            </div>

            {/* Day names */}
            <div className="mb-2 grid grid-cols-7 gap-1">
                {dayNames.map((name) => (
                    <div key={name} className="text-center text-xs font-semibold text-gray-500">
                        {name}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
}
