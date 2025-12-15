<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class PublicCatalogController extends Controller
{
    private array $services = [
        ['id' => 'svc-001', 'name' => 'Passport Renewal'],
        ['id' => 'svc-002', 'name' => 'Driver’s Permit Application'],
    ];

    private array $branches = [
        [
            'id' => 'br-001',
            'name' => 'Port of Spain',
            'serviceIds' => ['svc-001', 'svc-002'],
        ],
        [
            'id' => 'br-002',
            'name' => 'San Fernando',
            'serviceIds' => ['svc-001'],
        ],
    ];

    /** GET /services */
    public function listServices()
    {
        return response()->json([
            'services' => $this->services,
        ]);
    }

    /** GET /branches */
    public function listBranches(Request $request)
    {
        $serviceId = $request->query('serviceId');

        $branches = $this->branches;

        if ($serviceId) {
            $branches = array_values(array_filter(
                $branches,
                fn($branch) => in_array($serviceId, $branch['serviceIds'], true)
            ));
        }

        return response()->json([
            'branches' => $branches,
        ]);
    }

    /** POST /selections/service */
    public function selectService(Request $request)
    {
        $request->validate([
            'serviceId' => 'required|string',
        ]);

        $service = collect($this->services)
            ->firstWhere('id', $request->serviceId);

        if (!$service) {
            return response()->json([
                'code' => 'SERVICE_NOT_FOUND',
                'message' => 'The selected service does not exist.',
            ], Response::HTTP_NOT_FOUND);
        }

        $selectionId = 'sel-' . Str::random(8);

        return response()->json([
            'selectionId' => $selectionId,
            'serviceId' => $service['id'],
            'links' => [
                'branches' => "/api/branches?serviceId={$service['id']}",
                'selectBranch' => '/api/selections/branch',
            ],
        ], Response::HTTP_CREATED);
    }

    /** POST /selections/branch */
    public function selectBranch(Request $request)
    {
        $request->validate([
            'serviceId' => 'required|string',
            'branchId' => 'required|string',
        ]);

        $branch = collect($this->branches)
            ->firstWhere('id', $request->branchId);

        if (!$branch) {
            return response()->json([
                'code' => 'BRANCH_NOT_FOUND',
                'message' => 'The selected branch does not exist.',
            ], 404);
        }

        if (!in_array($request->serviceId, $branch['serviceIds'], true)) {
            return response()->json([
                'code' => 'SERVICE_NOT_AVAILABLE',
                'message' => 'This branch does not offer the selected service.',
            ], 409);
        }

        return response()->json([
            'serviceId' => $request->serviceId,
            'branchId' => $branch['id'],
            'link' => "/appointments/new?serviceId={$request->serviceId}&branchId={$branch['id']}",
        ], 201);
    }
}
