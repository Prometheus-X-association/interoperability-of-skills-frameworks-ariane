import fs from 'fs';

const mappingRules = {
    "role": {
        "Knowledges": { "@type": "xsd:string", "@id": "role:knowledge" },
        "Hard Skills": { "@type": "xsd:string", "@id": "role:hardSkill" }
    }
};

// Function to map values to JSON-LD format
function mapValuesToJSONLD(value, rule) {
    // Handling arrays of values for Knowledges and Hard Skills
    return value.map(item => ({ "@value": item, "@type": rule["@type"] }));
}

// Function to apply mapping rules to a role based on the details and rules
function applyMappingForRole(role, details, rules) {
    // Applying mapping to Knowledges and Hard Skills within each role
    let mappedDetails = {};
    for (const detailKey in details) {
        const rule = rules[detailKey];
        if (rule) {
            mappedDetails[rule["@id"]] = mapValuesToJSONLD(details[detailKey], rule);
        }
    }
    // Constructing the JSON-LD object for each role
    return {
        "@type": "role:JobRole",
        "role:name": role,
        ...mappedDetails
    };
}

// Function to transform the input data to JSON-LD format based on the mapping rules
function ontoTermTransform(inputData, mappingRules) {
    // Transforming the input data to JSON-LD format based on the mapping rules
    const transformedData = Object.keys(inputData).map(role => {
        return applyMappingForRole(role, inputData[role], mappingRules["role"]);
    });

    // Define the JSON-LD context
    // path to the ontology file as necessary
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = readJson(ontologyPath)['@context'];

    return {
        "@context": context,
        "graph": transformedData
    };
}

// readJson function to read a JSON file
function readJson(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

// main function to read the input JSON, transform it to JSON-LD, and save the output
function main() {
    const inputJsonPath = './input.json'; // Adjust this path as necessary
    const inputData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));

    const outputData = ontoTermTransform(inputData, mappingRules);

    const outputPath = './output.jsonld'; // The path where the output will be saved
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`The JSON-LD data has been saved to ${outputPath}`);
}

// Execute the main function
main();