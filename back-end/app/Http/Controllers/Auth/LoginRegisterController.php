<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use Validator;
use Illuminate\Support\Facades\Log;

class LoginRegisterController extends Controller
{
    /**
     * Register a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'firstname' => 'required|string|max:250',
            'lastname' => 'required|string|max:250',
            'phone' => 'required|string|max:250',
            'email' => 'required|string|email:rfc|max:250|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validate->fails()) {
            Log::error('User registration validation failed', [
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

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'phone' => $request->phone,
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $data['token'] = $user->createToken($request->email)->plainTextToken;
        $data['user'] = $user;

        $response = [
            'status' => 'success',
            'message' => 'User is created successfully.',
            'data' => $data,
        ];

        Log::info('User registered successfully', ['email' => $request->email]);
        return response()->json($response, 201);
    }

    /**
     * Authenticate the user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function login(Request $request)
    {
        $validate = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validate->fails()) {
            Log::error('User login validation failed', [
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

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            Log::error('Invalid credentials', [
                'error' => 'Invalid credentials',
                'request_data' => $request->all(),
            ]);

            return response()->json(
                [
                    'status' => 'failed',
                    'message' => 'Invalid credentials',
                ],
                401
            );
        }

        $data['token'] = $user->createToken($request->email)->plainTextToken;
        $data['user'] = $user;

        $response = [
            'status' => 'success',
            'message' => 'User is logged in successfully.',
            'data' => $data,
        ];

        Log::info('User logged in successfully', ['email' => $request->email]);

        return response()->json($response, 200);
    }

    /**
     * Log out the user from application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */

    public function logout(Request $request)
    {
        try {
            auth()
                ->user()
                ->tokens()
                ->delete();
        } catch (\Exception $e) {
            Log::error('Error deleting user tokens on logout', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(
                [
                    'status' => 'error',
                    'message' => 'Error logging out user',
                ],
                500
            );
        }

        Log::info('User logged out successfully', [
            'email' => auth()->user()->email,
        ]);

        return response()->json(
            [
                'status' => 'success',
                'message' => 'User is logged out successfully',
            ],
            200
        );
    }
}
