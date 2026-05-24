import { NextResponse } from 'next/server';

export const revalidate = 300; // Cache for 5 minutes (shorter for search)
export const dynamic = "force-dynamic";


const API_BASE_URL = 'https://api.shellaksa.com/';

export async function GET(request: Request) {
  try {
    // Get search term from query string
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('term') || '';

    // Validate search term
    if (!term || term.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Search term must be at least 2 characters',
      });
    }


    const response = await fetch(
      `${API_BASE_URL}/api/MainServices/search?term=${encodeURIComponent(term)}`,
      {
        next: { revalidate: 300 }, // 5 minutes cache
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend API returned ${response.status}`);
    }

    const result = await response.json();

    // Your backend returns: { succeeded, data, message, errors }
    if (!result.succeeded) {
      throw new Error(result.errors?.join(', ') || 'Search failed');
    }

    return NextResponse.json({
      success: true,
      data: result.data || [],
      term,
      count: result.data?.length || 0,
    });
  } catch (error) {
    console.error('Error searching services:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Search failed',
        data: [],
      },
      { status: 500 }
    );
  }
}