<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Validator;
use Illuminate\Support\Facades\Log;
use App\Notifications\TaskNotification;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = auth()->user();

        $tasks = $user
            ->tasks()
            ->latest()
            ->get();

        if ($tasks->isEmpty()) {
            Log::info('No Task found for user!', ['RequestFrom' => $user->id]);

            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'No Task found!',
                ],
                200
            );
        }

        $userName = $user->firstname . ' ' . $user->lastname;

        $response = [
            'status' => 'success',
            'message' => 'Tasks are retrieved successfully.',
            'user_name' => $userName,
            'data' => $tasks,
        ];

        return response()->json($response, 200);
    }

    public function store(Request $request)
    {
        try {
            $validate = Validator::make($request->all(), [
                'title' => 'required|string|max:250',
                'description' => 'required|string|',
            ]);

            if ($validate->fails()) {
                Log::error('Validation Error!', [
                    'errors' => $validate->errors(),
                    'request_data' => $request->all(),
                ]);

                return response()->json(
                    [
                        'status' => 'failed',
                        'message' => 'Validation Error!',
                        'data' => $validate->errors(),
                    ],
                    403
                );
            }

            $taskData = array_merge($request->all(), [
                'user_id' => auth()->user()->id,
                'status' => 'IN PROGRESS',
            ]);

            $Task = Task::create($taskData);

            $user = auth()->user();
            $userName = $user->firstname . ' ' . $user->lastname;

            $response = [
                'status' => 'success',
                'message' => 'Task is added successfully.',
                'data' => $Task,
                'user_name' => $userName,
            ];

            auth()
                ->user()
                ->notify(
                    (new TaskNotification(
                        'Task ' . $request->input('title') . ' Due'
                    ))->delay(now()->addMinutes(20))
                );

            Log::info('task Created successfully', [
                'User' => auth()->user()->id,
            ]);

            return response()->json($response, 200);
        } catch (\Exception $e) {
            Log::error('An error occurred while adding the task', [
                'errors' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'An error occurred while adding the task.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function show($id)
    {
        $Task = Task::find($id);

        if (is_null($Task)) {
            Log::error('No Task found!', ['RequestFrom' => auth()->user()->id]);
            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Task is not found!',
                ],
                200
            );
        }

        $response = [
            'status' => 'success',
            'message' => 'Task is retrieved successfully.',
            'data' => $Task,
        ];

        return response()->json($response, 200);
    }

    public function update(Request $request, $id)
    {
        $validate = Validator::make($request->all(), [
            'title' => 'string|max:250',
            'description' => 'string|',
            'status' => 'required|string|max:250',
        ]);

        if ($validate->fails()) {
            Log::error('Validation Error!', [
                'errors' => $validate->errors(),
                'request_data' => $request->all(),
            ]);

            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Validation Error!',
                    'data' => $validate->errors(),
                ],
                403
            );
        }

        $Task = Task::find($id);

        if (is_null($Task)) {
            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Task is not found!',
                ],
                200
            );
        }

        if (auth()->user()->id !== $Task->user_id) {
            Log::info('Unauthorized to update task ', [
                'User' => auth()->user()->id,
            ]);

            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Unauthorized.',
                ],
                403
            );
        }

        if ($Task->status == 'COMPLETED') {
            $Task->update([
                'title' => $request->input('title'),
                'description' => $request->input('description'),
            ]);
        } else {
            if ($request->input('status') === 'COMPLETED') {
                $request->merge(['completed_at' => now()]);
            }

            $Task->update($request->all());
        }

        $response = [
            'status' => 'success',
            'message' => 'Task is updated successfully.',
            'data' => $Task,
        ];

        auth()
            ->user()
            ->notify(
                (new TaskNotification(
                    'Task ' . $Task->title . ' ' . $request->input('status')
                ))->delay(now()->addMinutes(20))
            );

        Log::info('task updated successfully', ['User' => auth()->user()->id]);

        return response()->json($response, 200);
    }

    public function destroy($id)
    {
        $task = Task::find($id);

        if (is_null($task)) {
            Log::error('No Task found!', ['RequestFrom' => auth()->user()->id]);

            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Task is not found!',
                ],
                404
            );
        }

        if (auth()->user()->id !== $task->user_id) {
            Log::info('Unauthorized to  delete task ', [
                'User' => auth()->user()->id,
            ]);
            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Unauthorized.',
                ],
                403
            );
        }

        Task::destroy($id);

        auth()
            ->user()
            ->notify(
                new TaskNotification(
                    'Task ' . $task->title . ' deleted successfully'
                )
            );

        Log::info('task deleted successfully', ['User' => auth()->user()->id]);

        return response()->json(
            [
                'status' => 'success',
                'message' => 'Task is deleted successfully.',
            ],
            200
        );
    }
}
