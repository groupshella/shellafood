import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour
const API_BASE_URL = 'https://api.shellaksa.com';
export async function GET() {
  try {

    const response = await fetch(`${API_BASE_URL}/api/CarMakes/active`, {
      next: { revalidate: 0 }, // 50 minutes cache
      headers: {
        'Content-Type': 'application/json',
      },
    });


    if (!response.ok) {
      throw new Error('Failed to fetch makes');
    }

    const data = await response.json();

    // Transform to simple format for your select
    const makes = data.data.map((make: any) => ({
      value: make.id,
      label: make.name
    })).sort((a: any, b: any) => a.label.localeCompare(b.label));

    return NextResponse.json({
      success: true,
      data: makes,
      count: makes.length
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch car makes'
      },
      { status: 500 }
    );
  }
}