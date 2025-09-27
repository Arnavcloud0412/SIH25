import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { claimData } = body;

    if (!claimData) {
      return NextResponse.json(
        { success: false, error: 'Claim data is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
You are an expert advisor for Forest Rights Act (FRA) claimants in India. Based on the provided claim data, recommend relevant Centrally Sponsored Schemes (CSS) that can help the claimant.

Claim Data:
- Claimant Name: ${claimData.claimantName || 'Not provided'}
- Village: ${claimData.village || 'Not provided'}
- District: ${claimData.district || 'Not provided'}
- State: ${claimData.state || 'Not provided'}
- Tribal Group: ${claimData.tribalGroup || 'Not provided'}
- Claim Type: ${claimData.claimType || 'Not provided'}
- Scheduled Tribe: ${claimData.isScheduledTribe ? 'Yes' : 'No'}
- Other Traditional Forest Dweller: ${claimData.isOtherTraditionalForestDweller ? 'Yes' : 'No'}
- Land Area: ${claimData.landArea || 'Not specified'}
- Family Members: ${claimData.familyMembers ? JSON.stringify(claimData.familyMembers) : 'Not provided'}

Please recommend relevant Centrally Sponsored Schemes from the following categories:

1. **Livelihood and Employment Schemes**
2. **Education and Skill Development Schemes**
3. **Health and Nutrition Schemes**
4. **Housing and Infrastructure Schemes**
5. **Agriculture and Forest-based Livelihood Schemes**
6. **Social Security and Welfare Schemes**

For each recommended scheme, provide:
- Scheme Name
- Implementing Ministry/Department
- Brief Description (2-3 sentences)
- Eligibility Criteria (specific to FRA claimants)
- Benefits/Assistance Provided
- Application Process (brief steps)
- Contact Information (relevant department/website)
- Priority Level (High/Medium/Low based on relevance)

Format the response as a JSON object with the following structure:
{
  "recommendations": [
    {
      "schemeName": "Scheme Name",
      "ministry": "Ministry/Department",
      "description": "Brief description",
      "eligibility": "Eligibility criteria",
      "benefits": "Benefits provided",
      "applicationProcess": "Application steps",
      "contactInfo": "Contact details",
      "priority": "High/Medium/Low",
      "category": "Category name"
    }
  ],
  "summary": "Overall summary of recommendations",
  "totalSchemes": number
}

Focus on schemes that are most relevant to FRA claimants, especially those from Scheduled Tribes and Other Traditional Forest Dwellers. Prioritize schemes that can provide immediate livelihood support, education, health, and housing benefits.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini raw response:', text);

    // Try to parse the JSON response
    let recommendations;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
        console.log('Parsed recommendations:', recommendations);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback to a structured response
      recommendations = {
        recommendations: [
          {
            schemeName: "Pradhan Mantri Awas Yojana (PMAY)",
            ministry: "Ministry of Housing and Urban Affairs",
            description: "Provides financial assistance for housing to eligible beneficiaries including FRA claimants.",
            eligibility: "FRA claimants with valid forest rights, income below specified limits",
            benefits: "Financial assistance up to ₹1.5 lakh for house construction",
            applicationProcess: "Apply through Gram Panchayat or online portal with FRA certificate",
            contactInfo: "State Rural Development Department or PMAY website",
            priority: "High",
            category: "Housing and Infrastructure"
          },
          {
            schemeName: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            ministry: "Ministry of Agriculture and Farmers Welfare",
            description: "Direct income support to farmers including those with forest rights for agricultural activities.",
            eligibility: "FRA claimants engaged in agriculture on forest land",
            benefits: "₹6,000 per year in three installments",
            applicationProcess: "Register through Common Service Centre or online portal",
            contactInfo: "Agriculture Department or PM-KISAN portal",
            priority: "Medium",
            category: "Agriculture and Forest-based Livelihood"
          }
        ],
        summary: "Based on your FRA claim, you may be eligible for housing and agricultural support schemes. Please contact the relevant departments for detailed application procedures.",
        totalSchemes: 2
      };
    }

    return NextResponse.json({
      success: true,
      data: recommendations,
      message: 'Scheme recommendations generated successfully'
    });

  } catch (error) {
    console.error('Error generating scheme recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate scheme recommendations' },
      { status: 500 }
    );
  }
}
