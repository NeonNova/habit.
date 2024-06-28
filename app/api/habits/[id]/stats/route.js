// File: app/api/habits/[id]/stats/route.js
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const habitId = parseInt(params.id);
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '7d';

  try {
    const habit = await prisma.habit.findUnique({
      where: { id: habitId, userId: session.user.id },
      include: { logs: true },
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    const endDate = endOfDay(new Date());
    let startDate;

    switch (range) {
      case '7d': startDate = subDays(endDate, 7); break;
      case '1m': startDate = subMonths(endDate, 1); break;
      case '3m': startDate = subMonths(endDate, 3); break;
      case '6m': startDate = subMonths(endDate, 6); break;
      case '1y': startDate = subYears(endDate, 1); break;
      case 'max': startDate = new Date(0); break;
      default: startDate = subDays(endDate, 7);
    }

    startDate = startOfDay(startDate);

    const logs = habit.logs.filter(log => log.date >= startDate && log.date <= endDate);

    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const completedDays = new Set(logs.map(log => log.date.toDateString())).size;
    const completionRate = completedDays / totalDays;

    let currentStreak = 0;
    let date = new Date();
    while (date >= startDate) {
      const log = logs.find(log => log.date.toDateString() === date.toDateString());
      if (log && (
        (habit.type === 'habit' && log.value >= habit.timesPerDay) ||
        (habit.type === 'timed_habit' && log.value >= habit.timeGoal) ||
        (habit.type === 'bad_habit' && log.value <= habit.missesAllowed)
      )) {
        currentStreak++;
      } else {
        break;
      }
      date = subDays(date, 1);
    }

    const totalCompletions = logs.reduce((sum, log) => sum + log.value, 0);

    return NextResponse.json({
      completionRate,
      currentStreak,
      totalCompletions,
    });

  } catch (error) {
    console.error('Error fetching habit stats:', error);
    return NextResponse.json({ error: 'Error fetching habit stats' }, { status: 500 });
  }
}