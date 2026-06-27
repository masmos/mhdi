<?php

namespace App\Http\Controllers\Pharmacy;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Activitylog\Models\Activity;

class ActivityLogController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('view_activity_logs');

        $query = Activity::with('causer')
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'LIKE', "%{$search}%")
                    ->orWhere('subject_type', 'LIKE', "%{$search}%")
                    ->orWhereHas('causer', function ($q) use ($search) {
                        $q->where('name', 'LIKE', "%{$search}%")
                            ->orWhere('email', 'LIKE', "%{$search}%");
                    });
            });
        }

        if ($request->filled('event_type')) {
            $query->where('description', $request->event_type);
        }

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Get unique event types for filter
        $eventTypes = Activity::distinct()->pluck('description')->filter()->values();

        // Get unique subject types for filter
        $subjectTypes = Activity::distinct()->pluck('subject_type')
            ->filter()
            ->map(function ($type) {
                return class_basename($type);
            })
            ->unique()
            ->values();

        $logs = $query->paginate($request->per_page ?? 20)
            ->through(function ($log) {
                return [
                    'id' => $log->id,
                    'description' => $log->description,
                    'subject_type' => $log->subject_type ? class_basename($log->subject_type) : null,
                    'subject_id' => $log->subject_id,
                    'causer_id' => $log->causer_id,
                    'causer_name' => $log->causer?->name ?? 'System',
                    'causer_email' => $log->causer?->email ?? 'system@hospital.com',
                    'properties' => $log->properties,
                    'created_at' => $log->created_at,
                    'updated_at' => $log->updated_at,
                    'log_name' => $log->log_name,
                    'event' => $log->event,
                    'batch_uuid' => $log->batch_uuid,
                ];
            });

        // Get statistics
        $stats = [
            'total' => Activity::count(),
            'today' => Activity::whereDate('created_at', today())->count(),
            'this_week' => Activity::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'this_month' => Activity::whereMonth('created_at', now()->month)->count(),
            'by_event' => Activity::select('description', DB::raw('count(*) as total'))
                ->groupBy('description')
                ->orderBy('total', 'desc')
                ->limit(5)
                ->get()
                ->pluck('total', 'description')
                ->toArray(),
        ];

        return Inertia::render('pharmacy/activity_logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['search', 'event_type', 'subject_type', 'date_from', 'date_to']),
            'eventTypes' => $eventTypes,
            'subjectTypes' => $subjectTypes,
            'stats' => $stats,
        ]);
    }

    public function show($id): Response
    {
        $this->authorize('view_activity_logs');

        $log = Activity::with('causer')
            ->findOrFail($id);

        return Inertia::render('Pharmacy/ActivityLogs/Show', [
            'log' => [
                'id' => $log->id,
                'description' => $log->description,
                'subject_type' => $log->subject_type,
                'subject_id' => $log->subject_id,
                'causer_id' => $log->causer_id,
                'causer_name' => $log->causer?->name ?? 'System',
                'causer_email' => $log->causer?->email ?? 'system@hospital.com',
                'properties' => $log->properties,
                'created_at' => $log->created_at,
                'log_name' => $log->log_name,
                'event' => $log->event,
                'batch_uuid' => $log->batch_uuid,
            ],
        ]);
    }

    public function clear()
    {
        $this->authorize('clear_activity_logs');

        Activity::truncate();

        return redirect()->route('activity-logs.index')
            ->with('success', 'Activity logs cleared successfully.');
    }
}
