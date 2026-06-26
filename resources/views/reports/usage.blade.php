<!DOCTYPE html>
<html>

    <head>
        <title>Usage Report</title>
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
        <p>Period: {{ $period }}</p>
        <p>Generated: {{ $date }}</p>
        <table>
            <thead>
                <tr>
                    <th>Drug</th>
                    <th>Total Used</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($usage as $item)
                    <tr>
                        <td>{{ $item['drug'] }}</td>
                        <td>{{ $item['total'] }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </body>
</html>
