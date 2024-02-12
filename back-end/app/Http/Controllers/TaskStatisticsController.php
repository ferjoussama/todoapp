<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskStatisticsController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */

    public function dailyStatistics()
    {
        $date = now()->toDateString();
        $userId = auth()->id();

        $completedTasks = Task::whereDate('completed_at', $date)
            ->where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->count();

        $createdTasks = Task::whereDate('created_at', $date)
            ->where('user_id', $userId)
            ->count();

        return response()->json([
            'completed_tasks' => $completedTasks,
            'created_tasks' => $createdTasks,
        ]);
    }

    public function weeklyStatistics()
    {
        $startDate = now()->startOfWeek();
        $endDate = now()->endOfWeek();
        $userId = auth()->id();

        $completedTasks = Task::whereBetween('completed_at', [
            $startDate,
            $endDate,
        ])
            ->where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->count();

        $createdTasks = Task::whereBetween('created_at', [$startDate, $endDate])
            ->where('user_id', $userId)
            ->count();

        return response()->json([
            'completed_tasks' => $completedTasks,
            'created_tasks' => $createdTasks,
        ]);
    }

    public function monthlyStatistics()
    {
        $startDate = now()->startOfMonth();
        $endDate = now()->endOfMonth();
        $userId = auth()->id();

        $completedTasks = Task::whereBetween('completed_at', [
            $startDate,
            $endDate,
        ])
            ->where('user_id', $userId)
            ->whereNotNull('completed_at')
            ->count();

        $createdTasks = Task::whereBetween('created_at', [$startDate, $endDate])
            ->where('user_id', $userId)
            ->count();

        return response()->json([
            'completed_tasks' => $completedTasks,
            'created_tasks' => $createdTasks,
        ]);
    }
}
