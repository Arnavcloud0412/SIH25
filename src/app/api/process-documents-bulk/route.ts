import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI('AIzaSyDaSOVpFx6IPzCflDRXnIsuuoOZ8j4eags');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No files provided' 
      });
    }

    // Validate file types
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    
    if (validFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No valid files provided. Only PDF, JPEG, and PNG files are supported.' 
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Create the prompt for FRA document processing
    const prompt = `
You are an expert document processor specializing in Forest Rights Act (FRA) claims in India. 
Your task is to extract structured information from FRA claim documents with high accuracy.

CONTEXT:
- This is a Forest Rights Act claim document from India
- The document contains information about tribal communities and forest dwellers
- You need to extract specific fields for a digital form
- Be precise and only extract information that is clearly stated in the document
- If information is not available, leave the field empty

EXTRACT THE FOLLOWING INFORMATION FROM THE DOCUMENT:

1. claimant_name: Name of the person(s) making the claim
2. spouse_name: Name of the claimant's spouse (if mentioned)
3. father_mother_name: Name of father or mother of the claimant
4. address: Complete address of the claimant
5. village: Village name where the claimant resides
6. gram_panchayat: Gram Panchayat name
7. tehsil_taluka: Tehsil or Taluka name
8. district: District name
9. state: State name
10. scheduled_tribe: Whether the claimant belongs to Scheduled Tribe (Yes/No)
11. other_traditional_forest_dweller: Whether the claimant is a traditional forest dweller (Yes/No)
12. family_members: Names and ages of family members (if mentioned)
13. land_area: Area of land being claimed (in acres or hectares)
14. tribal_group: Specific tribal group/community name (if mentioned)
15. claim_type: Type of claim (Individual Forest Rights, Community Forest Rights, Habitat Rights)

IMPORTANT INSTRUCTIONS:
- Extract only information that is explicitly mentioned in the document
- For Yes/No fields, use "Yes" or "No" only if clearly stated
- For land area, include the unit (acres/hectares)
- For claim type, use standard terminology: "Individual Forest Rights (IFR)", "Community Forest Rights (CFR)", or "Habitat Rights"
- If any field is not found, return an empty string for that field
- Be conservative - it's better to leave a field empty than to guess

Return the extracted data in the following JSON format:
{
  "claimant_name": "extracted name or empty string",
  "spouse_name": "extracted name or empty string",
  "father_mother_name": "extracted name or empty string",
  "address": "extracted address or empty string",
  "village": "extracted village name or empty string",
  "gram_panchayat": "extracted gram panchayat or empty string",
  "tehsil_taluka": "extracted tehsil/taluka or empty string",
  "district": "extracted district or empty string",
  "state": "extracted state or empty string",
  "scheduled_tribe": "Yes/No or empty string",
  "other_traditional_forest_dweller": "Yes/No or empty string",
  "family_members": "extracted family members info or empty string",
  "land_area": "extracted area with unit or empty string",
  "tribal_group": "extracted tribal group or empty string",
  "claim_type": "extracted claim type or empty string"
}

Process the document and return only the JSON object with the extracted data.
`;

    const processedResults = [];
    let processedCount = 0;

    // Process each file
    for (const file of validFiles) {
      try {
        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const mimeType = file.type;

        // Process the document with Gemini
        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64,
              mimeType: mimeType
            }
          }
        ]);

        const response = await result.response;
        const extractedText = response.text();

        // Parse the JSON response
        let extractedData;
        try {
          // Clean the response text to extract JSON
          const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            extractedData = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error(`Error parsing Gemini response for file ${file.name}:`, parseError);
          continue;
        }

        // Calculate accuracy
        const totalFields = Object.keys(extractedData).length;
        const filledFields = Object.values(extractedData).filter(value => 
          value && value.toString().trim() !== ''
        ).length;
        const accuracy = Math.round((filledFields / totalFields) * 100);

        processedResults.push({
          filename: file.name,
          extractedData: extractedData,
          accuracy: accuracy,
          success: true
        });

        processedCount++;

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        processedResults.push({
          filename: file.name,
          error: error.message,
          success: false
        });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount: processedCount,
      totalFiles: validFiles.length,
      results: processedResults
    });

  } catch (error) {
    console.error('Error in bulk processing:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process documents' 
    });
  }
}
