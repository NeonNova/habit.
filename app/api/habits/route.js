import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all habits
export async function GET() {
  try {
    const habits = await prisma.habit.findMany({
      where: { isActive: true },
      include: { logs: true },
    });
    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ error: 'Error fetching habits' }, { status: 500 });
  }
}



export async function POST(request) {
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
  try {
    const data = await request.json();
    const updatedHabit = await prisma.habit.update({
      where: { id: data.id },
      data: {
        name: data.name,
        type: data.type,
        target: data.target,
        unit: data.unit,
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
        where: { habitId: parsedHabitId }
      });
      
      // Then, delete the habit
      return prisma.habit.delete({
        where: { id: parsedHabitId }
      });
    });
    
    if (!deletedHabit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }
    
    return NextResponse.json(deletedHabit);
  } catch (error) {
    console.error('Error in DELETE /api/habits:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const data = await request.json();
    const { habitId, value, date } = data;

    const habit = await prisma.habit.findUnique({
      where: { id: parseInt(habitId) },
      include: { logs: true },
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
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