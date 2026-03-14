import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function POST(request: NextRequest) {
	try {
		// Get auth token from cookies
		const cookieStore = await cookies();
		const authToken = cookieStore.get('auth_token')?.value;

		if (!authToken) {
			return NextResponse.json(
				{ error: 'Authentication required' },
				{ status: 401 }
			);
		}

		// Parse request body
		const body = await request.json();

		// Map form data to API format
		const apiPayload: any = {
			first_name: body.firstName || '',
			grandfather_name: body.grandFatherName || '',
			father_name: body.fatherName || '',
			last_name: body.lastName || '',
			birth_date: body.birthDate || '',
			national_id: body.personalIdNumber || '',
			marital_status: body.socialStatus || '',
			number_of_family_members: body.familyMembersCount || '',
			identity_card_number: body.personalIdNumber || '',
			end_date: body.idExpirationDate || '',
			mobile: body.phoneNumber || '',
			house_type: body.homeType || '',
			city: body.city || '',
			neighborhood: body.neighborhood || '',
			name_of_employer: body.companyName || '',
			total_salary: body.grossSalary || '',
			source_of_income: body.incomeSource || '',
			monthly_amount: body.additionalAmount || '',
			salary_day: body.salaryDay || '',
		};

		// Handle installments - sum all commitment amounts
		if (body.installments) {
			try {
				const installments = typeof body.installments === 'string' 
					? JSON.parse(body.installments) 
					: body.installments;
				
				if (Array.isArray(installments)) {
					const totalInstallments = installments.reduce((sum, item) => {
						const amount = parseFloat(item.commitmentAmount || '0');
						return sum + (isNaN(amount) ? 0 : amount);
					}, 0);
					apiPayload.Installments = totalInstallments.toString();
				}
			} catch (e) {
				// If parsing fails, set to 0
				apiPayload.Installments = '0';
			}
		} else {
			apiPayload.Installments = '0';
		}

		// Optional fields that exist in form but not required by API
		if (body.nationality) apiPayload.nationality = body.nationality;
		if (body.whatsappNumber) apiPayload.whatsapp_number = body.whatsappNumber;
		if (body.email) apiPayload.email = body.email;
		if (body.homeNature) apiPayload.home_nature = body.homeNature;
		if (body.addressDetails) apiPayload.address_details = body.addressDetails;
		if (body.locationHouse) apiPayload.location_house = body.locationHouse;
		if (body.jobTitle) apiPayload.job_title = body.jobTitle;
		if (body.yearsOfExperience) apiPayload.years_of_experience = body.yearsOfExperience;
		if (body.workAddress) apiPayload.work_address = body.workAddress;
		if (body.locationWork) apiPayload.location_work = body.locationWork;

		const url = `https://shellafood.com/api/v1/qidha-wallet/store`;

		console.log('[Kaidha API Route] Submitting form:', {
			url,
			hasAuthToken: !!authToken,
		});

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Host': 'shellafood.com',
				'Authorization': `Bearer ${authToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(apiPayload),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('[Kaidha API Route] Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorText,
			});

			let errorData;
			try {
				errorData = JSON.parse(errorText);
			} catch {
				errorData = { message: errorText || 'Failed to submit form' };
			}

			return NextResponse.json(
				{ 
					error: errorData.message || `Failed to submit form: ${response.statusText}`,
					details: errorData 
				},
				{ status: response.status }
			);
		}

		const data = await response.json();

		console.log('[Kaidha API Route] Success:', {
			hasData: !!data,
		});

		return NextResponse.json(data);
	} catch (error: any) {
		console.error('[Kaidha API Route] Caught error:', {
			message: error?.message,
			stack: error?.stack,
			name: error?.name,
		});
		return NextResponse.json(
			{ error: 'Internal server error', details: error?.message },
			{ status: 500 }
		);
	}
}

