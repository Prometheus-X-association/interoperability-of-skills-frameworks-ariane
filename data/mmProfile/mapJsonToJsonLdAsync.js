import fs from 'fs/promises';

// Mapping rules for different types of data
const mappingRules = {
    "educationalResource": {
        "date": { "@type": "xsd:dateTime", "@id": "mms:date" },
        "keywords": { "@type": "xsd:string", "@id": "mms:keywords" },
        "picture": { "@type": "xsd:string", "@id": "mms:picture" },
        "title": { "@type": "xsd:string", "@id": "mms:title" },
        "url": { "@type": "xsd:string", "@id": "mms:url" }
    },
    "experience": {
        "Experience Name": { "@type": "xsd:string", "@id": "soo:experienceName" },
        "User ID": { "@type": "xsd:string", "@id": "soo:userID" },
        "Date": { "@type": "xsd:date", "@id": "soo:date" },
        "Associated Soft Skill Block": { "@type": "xsd:string", "@id": "soo:associatedSoftSkillBlock" },
        "Results": { "@type": "xsd:string", "@id": "soo:results" }
    },
    "jobPosting": {
        "Job ID": { "@type": "xsd:integer", "@id": "jpo:jobID" },
        "Job Title": { "@type": "xsd:string", "@id": "jpo:jobTitle" },
        "Technical Skills": { "@type": "xsd:string", "@id": "jpo:technicalSkills" },
        "Human Skills": { "@type": "xsd:string", "@id": "jpo:humanSkills" },
        "Next Career Steps": { "@type": "xsd:string", "@id": "jpo:nextCareerSteps" }
    },
    "userExperience": {
        "Experience Ids": { "@type": "xsd:integer", "@id": "ue:experienceIds" },
        "Experience Labels": { "@type": "xsd:string", "@id": "ue:experienceLabels" },
        "Associated Hard Skills": { "@type": "xsd:string", "@id": "ue:associatedHardSkills" },
        "Associated Soft Skills": { "@type": "xsd:string", "@id": "ue:associatedSoftSkills" },
        "Suggested Experiences": { "@type": "xsd:string", "@id": "ue:suggestedExperiences" },
        "Liked Experiences": { "@type": "xsd:string", "@id": "ue:likedExperiences" },
        "Account": { "@type": "xsd:string", "@id": "ue:account" }
    }
};

// Async function to read a JSON file
async function readJsonAsync(filePath) {
    try {
        const fileData = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error(`Error reading or parsing file ${filePath}:`, error);
        throw error;
    }
}

// Function to map values to JSON-LD format
function mapValuesToJSONLD(value, rule) {
    if (Array.isArray(value)) {
        return value.map(item => ({ "@value": item, "@type": rule["@type"] }));
    } else {
        return { "@id": rule["@id"], "@value": value, "@type": rule["@type"] };
    }
}

// Function to apply mapping rules to an item based on its type
function applyMappingRules(item, rules) {
    let mappedItem = {};
    for (const inputKey in item) {
        const rule = rules[inputKey];
        if (rule) {
            mappedItem[rule["@id"]] = mapValuesToJSONLD(item[inputKey], rule);
        }
    }
    return mappedItem;
}

// Function to detect the type of an item
function detectItemType(item) {
    if (item.hasOwnProperty("Experience Ids")) return "userExperience";
    if (item.hasOwnProperty("Experience Name")) return "experience";
    if (item.hasOwnProperty("Job ID")) return "jobPosting";
    return "educationalResource";
}

// Function to transform input data to JSON-LD format based on mapping rules
function transformDataToJSONLD(inputData, mappingRules) {
    return inputData.map(item => {
        const type = detectItemType(item); // Detect the type of the item
        return applyMappingRules(item, mappingRules[type]);
    });
}

// Main async function to perform the transformation and save the output
async function main() {
    try {
        const inputJsonPath = './input.json';
        const ontologyPath = './mm-profile-1.0.0.jsonld';
        const outputPath = './output.jsonld';

        const [inputData, ontologyContext] = await Promise.all([
            readJsonAsync(inputJsonPath),
            readJsonAsync(ontologyPath),
        ]);

        const transformedData = transformDataToJSONLD(inputData, mappingRules);

        const outputData = {
            "@context": ontologyContext["@context"],
            "graph": transformedData
        };

        await fs.writeFile(outputPath, JSON.stringify(outputData, null, 2));
        console.log(`The JSON-LD data has been saved to ${outputPath}`);
    } catch (error) {
        console.error('Failed to process:', error);
    }
}

main();


// # .env file
// INPUT_JSON_PATH=./input.json
// ONTOLOGY_PATH=./mm-profile-1.0.0.jsonld
// OUTPUT_PATH=./output.jsonld
// API_KEY=api_key
// const inputJsonPath = process.env.INPUT_JSON_PATH || './input.json';
// const ontologyPath = process.env.ONTOLOGY_PATH || './mm-profile-1.0.0.jsonld';
// const outputPath = process.env.OUTPUT_PATH || './output.jsonld';
// const inputJsonPath = process.env.INPUT_JSON_PATH;
// const ontologyPath = process.env.ONTOLOGY_PATH;
// const outputPath = process.env.OUTPUT_PATH;
// dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
// import dotenv from 'dotenv';
//
// // Load environment variables
// dotenv.config();
// import fs from 'fs';
//
// // mapping rules for different types of data
// const mappingRules = {
//     "educationalResource": {
//         "date": { "@type": "xsd:dateTime", "@id": "mms:date" },
//         "keywords": { "@type": "xsd:string", "@id": "mms:keywords" },
//         "picture": { "@type": "xsd:string", "@id": "mms:picture" },
//         "title": { "@type": "xsd:string", "@id": "mms:title" },
//         "url": { "@type": "xsd:string", "@id": "mms:url" }
//     },
//     "experience": {
//         "Experience Name": { "@type": "xsd:string", "@id": "soo:experienceName" },
//         "User ID": { "@type": "xsd:string", "@id": "soo:userID" },
//         "Date": { "@type": "xsd:date", "@id": "soo:date" },
//         "Associated Soft Skill Block": { "@type": "xsd:string", "@id": "soo:associatedSoftSkillBlock" },
//         "Results": { "@type": "xsd:string", "@id": "soo:results" }
//     },
//     "jobPosting": {
//         "Job ID": { "@type": "xsd:integer", "@id": "soo:jobID" },
//         "Job Title": { "@type": "xsd:string", "@id": "soo:jobTitle" },
//         "Technical Skills": { "@type": "xsd:string", "@id": "soo:technicalSkills" },
//         "Human Skills": { "@type": "xsd:string", "@id": "soo:humanSkills" },
//         "Next Career Steps": { "@type": "xsd:string", "@id": "soo:nextCareerSteps" }
//     },
//     "userExperience": {
//         "Experience Ids": { "@type": "xsd:integer", "@id": "soo:experienceIds" },
//         "Experience Labels": { "@type": "xsd:string", "@id": "soo:experienceLabels" },
//         "Associated Hard Skills": { "@type": "xsd:string", "@id": "soo:associatedHardSkills" },
//         "Associated Soft Skills": { "@type": "xsd:string", "@id": "soo:associatedSoftSkills" },
//         "Suggested Experiences": { "@type": "xsd:string", "@id": "soo:suggestedExperiences" },
//         "Liked Experiences": { "@type": "xsd:string", "@id": "soo:likedExperiences" },
//         "Account": { "@type": "xsd:string", "@id": "soo:account" }
//     }
// };
//
// // Function to map values to JSON-LD format
// function mapValuesToJSONLD(value, rule) {
//     if (Array.isArray(value)) {
//         return value.map(item => ({ "@value": item, "@type": rule["@type"] }));
//     } else {
//         return { "@id": rule["@id"], "@value": value, "@type": rule["@type"] };
//     }
// }
//
// // Function to apply mapping rules to an item based on the type
// function applyMapping(item, rules) {
//     let mappedItem = {};
//     for (const inputKey in item) {
//         const rule = rules[inputKey];
//         if (rule) {
//             mappedItem[rule["@id"]] = mapValuesToJSONLD(item[inputKey], rule);
//         }
//     }
//     return mappedItem;
// }
//
// // Function to detect the type of the item
// function detectType(item) {
//     if (item.hasOwnProperty("Experience Ids")) {
//         return "userExperience";
//     } else if (item.hasOwnProperty("Experience Name")) {
//         return "experience";
//     } else if (item.hasOwnProperty("Job ID")) {
//         return "jobPosting";
//     } else {
//         return "educationalResource";
//     }
// }
//
// // Function to transform the input data to JSON-LD format based on the mapping rules
// function ontoTermTransform(inputData, mappingRules) {
//     const transformedData = inputData.map(item => {
//         const type = detectType(item); // Detect the type of the item
//         return applyMapping(item, mappingRules[type]);
//     });
//     // Define the JSON-LD context
//     const ontologyPath = './mm-profile-1.0.0.jsonld';
//     const context = readJson(ontologyPath)['@context'];
// // Return the transformed data with the context
//     return {
//         "@context": context,
//         "graph": transformedData
//     };
// }
//
// // readJson function to read a JSON file
// function readJson(filePath) {
//     const fileData = fs.readFileSync(filePath, 'utf8');
//     return JSON.parse(fileData);
// }
// // Main function to read the input JSON, transform it to JSON-LD, and save the output
// function main() {
//     const inputJsonPath = './input.json'; // Adjust this path as necessary
//     const inputData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
//
//     const outputData = ontoTermTransform(inputData, mappingRules);
//
//     const outputPath = './output.jsonld'; // The path where the output will be saved
//     fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
//     console.log(`The JSON-LD data has been saved to ${outputPath}`);
// }
//
// // Run the main function
// main();