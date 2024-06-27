import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// GET all habits
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const habits = await prisma.habit.findMany({
      where: { userId: session.user.id, isActive: true },
      include: { logs: true },
    });
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Error fetching habits' }, { status: 500 });
  }
}

// POST (create) habit
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const habit = await prisma.habit.create({
      data: {
        name: data.name,
        type: data.type,
        timesPerDay: data.type === 'habit' ? data.target : 1,
        timeGoal: data.type === 'timed_habit' ? data.target : null,
        missesAllowed: data.type === 'bad_habit' ? data.target : null,
        isActive: true,
        userId: session.user.id,
      },
    });
    return NextResponse.json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ error: 'Error creating habit', details: error.message }, { status: 500 });
  }
}

// PUT (update) habit
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const updatedHabit = await prisma.habit.update({
      where: { id: data.id, userId: session.user.id },
      data: {
        name: data.name,
        type: data.type,
        timesPerDay: data.type === 'habit' ? data.target : 1,
        timeGoal: data.type === 'timed_habit' ? data.target : null,
        missesAllowed: data.type === 'bad_habit' ? data.target : null,
        isActive: data.isActive,
      },
    });
    return NextResponse.json(updatedHabit);
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ error: 'Error updating habit' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('id');
    
    if (!habitId) {
      return NextResponse.json({ error: 'Habit ID is required' }, { status: 400 });
    }
    
    const parsedHabitId = parseInt(habitId);
    if (isNaN(parsedHabitId)) {
      return NextResponse.json({ error: 'Invalid Habit ID' }, { status: 400 });
    }
    
    // Use a transaction to delete logs and habit
    const deletedHabit = await prisma.$transaction(async (prisma) => {
      // First, delete all logs associated with this habit
      await prisma.log.deleteMany({
        where: { habitId: parsedHabitId, habit: { userId: session.user.id } }
      });
      
      // Then, delete the habit
      return prisma.habit.deleteMany({
        where: { id: parsedHabitId, userId: session.user.id }
      });
    });
    
    if (deletedHabit.count === 0) {
      return NextResponse.json({ error: 'Habit not found or unauthorized' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/habits:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { habitId, value, date } = data;

    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(habitId), userId: session.user.id },
      include: { logs: true },
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found or unauthorized' }, { status: 404 });
    }

    const existingLog = habit.logs.find(log => 
      new Date(log.date).toISOString().split('T')[0] === date
    );

    let newValue = parseFloat(value);

    let updatedLog;
    if (existingLog) {
      updatedLog = await prisma.log.update({
        where: { id: existingLog.id },
        data: {
          value: newValue,
        },
      });
    } else {
      updatedLog = await prisma.log.create({
        data: {
          habitId: parseInt(habitId),
          value: newValue,
          date: new Date(date),
        },
      });
    }

    return NextResponse.json(updatedLog);
  } catch (error) {
    console.error('Error updating/adding log:', error);
    return NextResponse.json({ error: 'Error updating/adding log' }, { status: 500 });
  }
}