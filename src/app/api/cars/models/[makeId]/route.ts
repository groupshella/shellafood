import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

interface RouteParams {
  params: Promise<{
    makeId: string;
  }>;
}
const API_BASE_URL = 'https://api.shellaksa.com';
export async function GET(request: Request, { params }: RouteParams) {
  // ✅ AWAIT the params
  const { makeId } = await params;

  console.log('makeId:', makeId);

  try {
    const response = await fetch(`${API_BASE_URL}/api/CarModels/make/${makeId}`, {
      next: { revalidate: 0 }, // 50 minutes cache
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    const data = await response.json();

    // Transform to simple format
    const models = data.data.map((model: any) => ({
      value: model.id,
      label: model.name
    })).sort((a: any, b: any) => a.label.localeCompare(b.label));

    return NextResponse.json({
      success: true,
      data: models,
      count: models.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch car models'
      },
      { status: 500 }
    );
  }
}