import fs from 'fs';

// mapping rules for different types of data
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

// Function to map values to JSON-LD format
function mapValuesToJSONLD(value, rule) {
    if (Array.isArray(value)) {
        return value.map(item => ({ "@value": item, "@type": rule["@type"] }));
    } else {
        return { "@id": rule["@id"], "@value": value, "@type": rule["@type"] };
    }
}

// Function to apply mapping rules to an item based on the type
function applyMapping(item, rules) {
    let mappedItem = {};
    for (const inputKey in item) {
        const rule = rules[inputKey];
        if (rule) {
            mappedItem[rule["@id"]] = mapValuesToJSONLD(item[inputKey], rule);
        }
    }
    return mappedItem;
}

// Function to detect the type of the item
function detectType(item) {
    if (item.hasOwnProperty("Experience Ids")) {
        return "userExperience";
    } else if (item.hasOwnProperty("Experience Name")) {
        return "experience";
    } else if (item.hasOwnProperty("Job ID")) {
        return "jobPosting";
    } else {
        return "educationalResource";
    }
}

// Function to transform the input data to JSON-LD format based on the mapping rules
function ontoTermTransform(inputData, mappingRules) {
    const transformedData = inputData.map(item => {
        const type = detectType(item); // Detect the type of the item
        return applyMapping(item, mappingRules[type]);
    });
    // Define the JSON-LD context
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = readJson(ontologyPath)['@context'];
// Return the transformed data with the context
    return {
        "@context": context,
        "graph": transformedData
    };
}
function readJson(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}
// Main function to read the input JSON, transform it to JSON-LD, and save the output
function main() {
    const inputJsonPath = './input.json'; // Adjust this path as necessary
    const inputData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));

    const outputData = ontoTermTransform(inputData, mappingRules);

    const outputPath = './output.jsonld'; // The path where the output will be saved
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`The JSON-LD data has been saved to ${outputPath}`);
}

export { mapValuesToJSONLD, applyMapping, detectType, ontoTermTransform, mappingRules };

// Run the main function
main();