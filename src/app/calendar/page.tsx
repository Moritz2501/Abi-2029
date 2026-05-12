'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BurgerMenu } from '@/components/BurgerMenu';

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
}

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = selectedDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDay = getFirstDayOfMonth(selectedDate);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="min-h-screen bg-dark-bg">
      <BurgerMenu />

      <div className="pt-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-white mb-8">📅 Event-Kalender</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2 glass-lg rounded-3xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">{monthName}</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
                      )
                    }
                    className="btn-glass px-4 py-2"
                  >
                    ←
                  </button>
                  <button
                    onClick={() =>
                      setSelectedDate(
                        new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
                      )
                    }
                    className="btn-glass px-4 py-2"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
                  <div key={day} className="text-center text-white/60 text-sm font-semibold py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {emptyDays.map((i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {days.map((day) => {
                  const currentDate = new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    day
                  );
                  const dayEvents = events.filter((e) =>
                    e.date.startsWith(currentDate.toISOString().split('T')[0])
                  );

                  return (
                    <motion.div
                      key={day}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`aspect-square rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        dayEvents.length > 0
                          ? 'glass-glossy bg-accent-purple/20'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-white font-semibold">{day}</span>
                      {dayEvents.length > 0 && (
                        <span className="text-xs text-accent-purple font-bold">●</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Events List */}
            <div className="glass-lg rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">🎊 Anstehende Events</h3>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-white/60">Wird geladen...</p>
                ) : events.length === 0 ? (
                  <p className="text-white/60">Keine Events vorhanden</p>
                ) : (
                  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5).map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass-sm p-3 rounded-lg hover:bg-white/10 transition-all"
                    >
                      <h4 className="font-semibold text-white text-sm mb-1">{event.title}</h4>
                      <p className="text-xs text-white/60">
                        📅{' '}
                        {new Date(event.date).toLocaleDateString('de-DE', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                      {event.location && (
                        <p className="text-xs text-white/60">📍 {event.location}</p>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
