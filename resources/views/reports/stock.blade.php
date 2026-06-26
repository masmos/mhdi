<!DOCTYPE html>
<html>
    <head>
        <title>Stock Report</title>
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
        <table>
            <thead>
                <tr>
                    <th>Drug</th>
                    <th>Total Stock</th>
                    <th>Total Value (UGX)</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($drugs as $drug)
                    <tr>
                        <td>{{ $drug->name }}</td>
                        <td>{{ $drug->total_stock }}</td>
                        <td>{{ number_format($drug->total_value, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>
        <p><strong>Grand Total: {{ number_format($total_value, 2) }} UGX</strong></p>
    </body>
</html>
