import { NextResponse } from 'next/server';

export const revalidate = 3000; // Cache for 50 minutes (same as backend)
const API_BASE_URL = 'https://api.shellaksa.com/';
interface RouteParams {
  params: Promise<{
    service: string; // Match the folder name [service]
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  // ✅ AWAIT the params
  const { service: serviceId } = await params; // Extract 'service' and rename to 'serviceId'
  console.log('serviceId:', serviceId);

  try {
    const response = await fetch(`${API_BASE_URL}/api/MainServiceCategories/service/${serviceId}`, {
      next: { revalidate: 3000 }, // 50 minutes cache
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {

      throw new Error(`Backend API returned ${response.status}`);
    }

    const result = await response.json();

    // Your backend returns: { succeeded, data, message, errors }
    if (!result.succeeded) {
      throw new Error(result.errors?.join(', ') || 'Failed to fetch categories');
    }
    return NextResponse.json({
      success: true,
      data: result.data || [],
      message: result.message,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        data: [],
      },
      { status: 500 }
    );
  }
}