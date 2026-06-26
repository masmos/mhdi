<!DOCTYPE html>
<html>
    <head>
        <title>Expiry Report</title>
        <style>
            body {
                font-family: DejaVu Sans, sans-serif;
            }

            table {
                width: 100%;
                border-collapse: collapse;
            }

            th,
            td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }

            th {
                background: #f2f2f2;
            }
        </style>
    </head>

    <body>
        <h1>{{ $title }}</h1>
        <p>Generated: {{ $date }}</p>
        <h2>Expired Batches</h2>
        @if ($expired->count())
            <table>
                <thead>
                    <tr>
                        <th>Batch</th>
                        <th>Drug</th>
                        <th>Expiry</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($expired as $b)
                        <tr>
                            <td>{{ $b->batch_number }}</td>
                            <td>{{ $b->drug->name }}</td>
                            <td>{{ $b->expiry_date->format('Y-m-d') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No expired batches.</p>
        @endif

        <h2>Expiring Soon (within 30 days)</h2>
        @if ($soon->count())
            <table>
                <thead>
                    <tr>
                        <th>Batch</th>
                        <th>Drug</th>
                        <th>Expiry</th>
                        <th>Days Left</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($soon as $b)
                        <tr>
                            <td>{{ $b->batch_number }}</td>
                            <td>{{ $b->drug->name }}</td>
                            <td>{{ $b->expiry_date->format('Y-m-d') }}</td>
                            <td>{{ $b->remaining_days }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No batches expiring soon.</p>
        @endif
    </body>
</html>
