import fs from 'fs';
// schema for the JSON-LD output
const schema = {
    "ExperienceMapping": {
        "@type": "soo:Experience",
        "properties": {
            "id": "soo:id",
            "experienceName": "soo:experienceName",
            "hasHardSkill": "soo:hasHardSkill",
            "hasSoftSkill": "soo:hasSoftSkill",
            "suggestedExperience": "soo:suggestedExperience",
            "likedExperience": "soo:likedExperience"
        }
    }
};
const SCHEMA_KEYS = {
    id: "Experience Ids",
    experienceName: "Experience Labels",
    hasHardSkill: "Associated Hard Skills",
    hasSoftSkill: "Associated Soft Skills",
    suggestedExperience: "Suggested Experiences",
    likedExperience: "Liked Experiences"
};
function validateArray(items, key) {
    if (!Array.isArray(items)) {
        console.error(`Error: Key '${key}' is not an array`, items);
        return false;
    }
    return true;
}
function mapValuesToJSONLD(values, key) {
    return values.map(value => {
        if (typeof value !== 'string' && typeof value !== 'number') {
            console.error(`Error: Invalid value for key '${key}'`, value);
            return { "@value": null };
        }
        return { "@value": value };
    });
}
function mapItemToJSONLD(item, schema) {
    const jsonLdObject = { "@type": schema.ExperienceMapping["@type"] };

    for (const schemaKey in schema.ExperienceMapping.properties) {
        const inputKey = SCHEMA_KEYS[schemaKey];

        if (!item.hasOwnProperty(inputKey)) {
            console.warn(`Warning: Key '${inputKey}' is missing`, item);
            jsonLdObject[schema.ExperienceMapping.properties[schemaKey]] = [];
            continue;
        }

        if (!validateArray(item[inputKey], inputKey)) {
            jsonLdObject[schema.ExperienceMapping.properties[schemaKey]] = [];
            continue;
        }

        jsonLdObject[schema.ExperienceMapping.properties[schemaKey]] = mapValuesToJSONLD(item[inputKey], inputKey);
    }

    return jsonLdObject;
}
function mapDataToJSONLD(inputData, schema) {
    if (!Array.isArray(inputData)) {
        throw new Error('Input data must be an array.');
    }

    return inputData
        .map(item => {
            if (typeof item !== 'object' || item === null) {
                console.error('Invalid item encountered:', item);
                return null;
            }
            return mapItemToJSONLD(item, schema);
        })
        .filter(Boolean);
}
// Function to read and parse JSON file
function readJson(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}
const inputJson = './input.json';
// Main function to convert input JSON to JSON-LD
function mapExperienceToJsonLd(inputJson) {
    const inputData = readJson(inputJson);
    const experiences = mapDataToJSONLD(inputData, schema);
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = readJson(ontologyPath)['@context'];
    return {
        "@context": context,
        "@graph": experiences
    };
}
// Usage
const mappedJsonLd = mapExperienceToJsonLd(inputJson);
const jsonLdString = JSON.stringify(mappedJsonLd, null, 2);
const outputPath = './output.jsonld';
fs.writeFileSync(outputPath, jsonLdString);
console.log(`The JSON-LD data has been saved to ${outputPath}`);


// import fs from 'fs';
//
// const inputJson = './input.json'
// function mapExperienceToJsonLd(inputJson) {
//     function readJson(filePath) {
//         const fileData = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(fileData); // parse JSON string to JSON object
//     }
//
//     const inputData = readJson(inputJson)
//
//     const experiences = inputData.map((item, index) => ({
//         "@type": "soo:Experience",
//         "soo:id": item["Experience Ids"].map(id => ({ "@value": id })),
//         "soo:experienceName": item["Experience Labels"].map(label => ({ "@value": label })),
//         "soo:hasHardSkill": item["Associated Hard Skills"].map(skill => ({
//             "@type": "soo:HardSkill",
//             "soo:name": skill
//         })),
//         "soo:hasSoftSkill": item["Associated Soft Skills"].map(skill => ({
//             "@type": "soo:SoftSkill",
//             "soo:name": skill
//         })),
//         "soo:suggestedExperience": item["Suggested Experiences"].map(exp => ({
//             "@type": "soo:Experience",
//             "soo:experienceName": { "@value": exp }
//         })),
//         "soo:likedExperience": item["Liked Experiences"].map(exp => ({
//             "@type": "soo:Experience",
//             "soo:experienceName": { "@value": exp }
//         }))
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
//         "@graph": experiences
//     };
// }
//
// const mappedJsonLd = mapExperienceToJsonLd(inputJson);
//
// const jsonLdString = JSON.stringify(mappedJsonLd, null, 2);
//
// const outputPath = './output.jsonld';
//
// fs.writeFileSync(outputPath, jsonLdString);
//
// console.log(`The JSON-LD data has been saved to ${outputPath}`);
//
// //console.log(JSON.stringify(mappedJsonLd, null, 2));