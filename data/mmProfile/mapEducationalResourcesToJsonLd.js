import fs from 'fs';

// Schema for the JSON-LD output
const schema = {
    "EducationalResource": {
        "@type": "mms:EducationalResource",
        "properties": {
            "date": "mms:date",
            "keywords": "mms:keywords",
            "picture": "mms:picture",
            "title": "mms:title",
            "url": "mms:url"
        }
    }
};

// Mapping rules based on the input JSON keys
const mappingRules = {
    "date": { "@type": "xsd:dateTime" },
    "keywords": { "@type": "xsd:string" },
    "picture": { "@type": "xsd:string" },
    "title": { "@type": "xsd:string" },
    "url": { "@type": "xsd:string" }
};

// Function to read and parse JSON file
function readJson(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

// Function to map values to JSON-LD format
function mapValuesToJSONLD(value, type) {
    return { "@value": value, "@type": type };
}

// Function to apply mapping rules to an item
function mapItemToJSONLD(item, schema, rules) {
    const jsonLdObject = { "@type": schema["@type"] };
    for (const key in schema.properties) {
        const property = schema.properties[key];
        const rule = rules[key];
        if (item[key] && rule) {
            jsonLdObject[property] = mapValuesToJSONLD(item[key], rule["@type"]);
        }
    }
    return jsonLdObject;
}

// Main function to convert input JSON to JSON-LD
function mapEducationalResourcesToJsonLd(inputJson) {
    const inputData = readJson(inputJson);
    const educationalResources = inputData.map(resource =>
        mapItemToJSONLD(resource, schema.EducationalResource, mappingRules)
    );
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = readJson(ontologyPath)['@context'];
    return {
        "@context": context,
        "@graph": educationalResources
    };
}

const inputJson = './input.json'
// Usage
const jsonLdOutput = mapEducationalResourcesToJsonLd(inputJson);
const jsonLdString = JSON.stringify(jsonLdOutput, null, 2);
const outputPath = './output.jsonld';
fs.writeFileSync(outputPath, jsonLdString);
console.log(`The JSON-LD data has been saved to ${outputPath}`);


// import fs from 'fs';
//
// const inputJson = './input.json'
//
// function mapEducationalResourcesToJsonLd(inputJson) {
//     function readJson(filePath) {
//         const fileData = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(fileData); // parse JSON string to JSON object
//     }
//     const inputData = readJson(inputJson)
//     console.log(inputData);
//     const educationalResources = inputData.map(resource => ({
//         "@type": "mms:EducationalResource",
//         "mms:date": {
//             "@value": resource.date,
//             "@type": "xsd:dateTime"
//         },
//         "mms:keywords": {
//             "@value": resource.keywords,
//             "@type": "xsd:string"
//         },
//         "mms:picture": {
//             "@value": resource.picture,
//             "@type": "xsd:string"
//         },
//         "mms:title": {
//             "@value": resource.title,
//             "@type": "xsd:string"
//         },
//         "mms:url": {
//             "@value": resource.url,
//             "@type": "xsd:string"
//         }
//     }));
//
//     const ontologyPath = './mm-profile-1.0.0.jsonld'
//
//     const context = readJson(ontologyPath)['@context']
//
//     console.log(context);
//
//     return {
//         "@context": context,
//         "@graph": educationalResources
//     };
// }
//
// const jsonLdOutput = mapEducationalResourcesToJsonLd(inputJson);
//
// const jsonLdString = JSON.stringify(jsonLdOutput, null, 2);
//
// const outputPath = './output.jsonld';
//
// fs.writeFileSync(outputPath, jsonLdString);
//
// console.log(`The JSON-LD data has been saved to ${outputPath}`);
//
// //console.log(JSON.stringify(jsonLdOutput, null, 2));
